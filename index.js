import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';
import { TextControl, Button, Spinner, TextHighlight, NavigableMenu } from '@wordpress/components';
import { safeDecodeURI, filterURLForDisplay } from '@wordpress/url';
import { decodeEntities } from '@wordpress/html-entities';

const NAMESPACE = 'gutenberg-post-picker';

/**
 * Post Picker
 *
 * @param {Object} props react props
 * @return {*} React JSX
 */
export const PostPicker = (props) => {
	const { 
        onSelectPost,
        label = '',
        postTypes = [ 'posts', 'pages' ],
        placeholder = ''
    } = props;

	const [searchString, setSearchString] = useState('');
	const [searchResults, setSearchResults] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [selectedItem, setSelectedItem] = useState(null);

	function handleItemSelection(post) {
		onSelectPost(post);
		setSearchResults([]);
		setSearchString('');
	}

	/**
	 * Using the keyword and the list of tags that are linked to the parent block
	 * search for posts that match and return them to the autocomplete component.
	 *
	 * @param {string} keyword search query string
	 */
	const handleSearchStringChange = (keyword) => {
		setSearchString(keyword);
        setIsLoading(true);
         
        Promise.all( postTypes.map( postType => apiFetch({
            path: `/wp/v2/${postType}?search=${keyword}`,
        }) ) ).then( (results) => {
            setSearchResults( results.reduce( (result, final) => [...final, ...result], [] ) );
            setIsLoading( false );
        })
    };
    
    function handleSelection( item ) {
        if ( item === 0) {
            setSelectedItem( null );
        }

        setSelectedItem( item );
    }

	return (
		<div className={`${NAMESPACE}`}>
            <NavigableMenu onNavigate={ handleSelection } orientation={ 'vertical' }>
			<TextControl
				label={label}
				value={searchString}
                onChange={handleSearchStringChange}
                placeholder={ placeholder }
			/>
			{searchString.length ? (
                    <ul
                        className={`${NAMESPACE}-grid`}
                        style={{
                            marginTop: '0',
                            marginBottom: '0',
                            marginLeft: '0',
                            paddingLeft: '0',
                            listStyle: "none"
                        }}
                    >
                        {isLoading && <Spinner />}
                        {!isLoading && !searchResults.length && (
                            <li className={`${NAMESPACE}-grid-item`}>
                                <Button disabled>{__('No Items found', NAMESPACE)}</Button>
                            </li>
                        )}
                        {searchResults.map((post, index) => {
                            if (!post.title.rendered.length) {
                                return null;
                            }

                            const uniqueId = `${post.slug}-preview`;
                            
                            return (
                                <li key={post.id} HtmlFor={ uniqueId } className={`${NAMESPACE}-grid-item`} style={ {
                                    marginBottom: "0"
                                } }>
                                    <SearchItem
                                        onClick={() => handleItemSelection(post)}
                                        searchTerm={ searchString }
                                        suggestion={ post }
                                        isSelected={ selectedItem === index + 1 }
                                        id={ uniqueId }
                                    />
                                </li>
                            );
                        })}
                    </ul>
			) : null}
            </NavigableMenu>
		</div>
	);
};

export function SelectedPostPreview( props ) {

    const { post, label } = props;

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column'
        }}>
            <label>{label}</label>
            <SearchItem 
                suggestion={ post }
                onClick={ null }
            />
        </div>
    )
}

function SearchItem( props ) {
    const {
        suggestion,
        onClick,
        searchTerm = '',
        isSelected = false,
        id
    } = props;

    return (
		<Button
            id={ id }
			onClick={ onClick }
            className={ `block-editor-link-control__search-item is-entity ${ isSelected && 'is-selected' }` }
            style={{
                borderRadius: '0'
            }}
		>
			<span className="block-editor-link-control__search-item-header">
				<span className="block-editor-link-control__search-item-title">
					<TextHighlight
						text={ decodeEntities( suggestion.title.rendered ) }
						highlight={ searchTerm }
					/>
				</span>
				<span
					aria-hidden={ true }
					className="block-editor-link-control__search-item-info"
				>
                    {  
                        filterURLForDisplay(
                            safeDecodeURI( suggestion.link )
                        ) || '' 
                    }
				</span>
			</span>
			{ suggestion.type && (
				<span className="block-editor-link-control__search-item-type">
					{ /* Rename 'post_tag' to 'tag'. Ideally, the API would return the localised CPT or taxonomy label. */ }
					{ suggestion.type === 'post_tag' ? 'tag' : suggestion.type }
				</span>
			) }
		</Button>
	);
}
