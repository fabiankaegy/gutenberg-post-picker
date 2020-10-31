import { __ } from '@wordpress/i18n';
import { useState, RawHTML } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';
import { TextControl, Popover, Button, Spinner } from '@wordpress/components';

const NAMESPACE = 'gutenberg-post-picker';

/**
 * Post Picker
 *
 * @param {Object} props react props
 * @return {*} React JSX
 */
export const PostPicker = (props) => {
	const { onSelectPost, label = '' } = props;

	const [searchString, setSearchString] = useState('');
	const [searchResults, setSearchResults] = useState([]);
	const [isLoading, setIsLoading] = useState(false);

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
		Promise.all([
			apiFetch({
				path: `/wp/v2/pages?search=${keyword}`,
			}),
			apiFetch({
				path: `/wp/v2/posts?search=${keyword}`,
			}),
		]).then(([pages, posts]) => {
			setSearchResults([...pages, ...posts]);
			setIsLoading(false);
		});
	};

	return (
		<div className={`${NAMESPACE}`}>
			<TextControl
				label={label}
				value={searchString}
				onChange={handleSearchStringChange}
			/>
			{searchString.length ? (
				<Popover focusOnMount={false} noArrow={false}>
					<ul
                        className={`${NAMESPACE}-grid`}
                        style={{
                            marginTop: '0',
                            marginBottom: '0',
                        }}
                    >
						{isLoading && <Spinner />}
						{!isLoading && !searchResults.length && (
							<li className={`${NAMESPACE}-grid-item`}>
								<Button disabled>{__('No Items found', NAMESPACE)}</Button>
							</li>
						)}
						{searchResults.map((post, index) => {
                            const isLastItem = index === searchResults.length -1;
                            if (!post.title.rendered.length) {
                                return null;
                            }
                            
							return (
								<li key={post.id} className={`${NAMESPACE}-grid-item`} style={ {
                                    marginBottom: "0"
                                } }>
									<Button
                                        onClick={() => handleItemSelection(post)}
                                        style={ {
                                            display: "block",
                                            width: "100%",
                                            textAlign: "left",
                                            height: 'auto',
                                            padding: '0.5rem'
                                        } }
                                    >
                                        <PostPreview post={ post } />
									</Button>
									{ !isLastItem ?
                                        <hr style={{ margin: '0' }} /> : null
                                    }
								</li>
							);
						})}
					</ul>
				</Popover>
			) : null}
		</div>
	);
};

export function PostPreview( props ) {
    const { post } = props;
    return (
        <div {...{...props, post: null}}>
            <span style={{
                fontSize: "0.75em",
                color: 'var(--wp-admin-theme-color-darker-10)'
            }}>{post.type}</span>
            <RawHTML>{post.title.rendered}</RawHTML>
        </div>
    )
}

export function SelectedPostPreview( props ) {

    const { post, label } = props;

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column'
        }}>
            <label>{label}</label>
            <PostPreview 
                post={ post } 
                style={{
                    marginBottom: '1rem',
                    border: "1px solid #444",
                    borderRadius: "5px",
                    padding: "0.25rem"

                }}
            />
        </div>
    )
}