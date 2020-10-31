import { __ } from '@wordpress/i18n';
import { useState, RawHTML } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';
import { TextControl, Popover, Button, Spinner } from '@wordpress/components';

const NAMESPACE = 'fabiankaegy-postpicker';

/**
 * Post Picker
 *
 * @param {Object} props react props
 * @return {*} React JSX
 */
const PostPicker = (props) => {
	const { onSelectPost } = props;

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
		<div className={`${NAMESPACE}-post-picker`}>
			<TextControl
				label={__('Search for a Post / Page', NAMESPACE)}
				value={searchString}
				onChange={handleSearchStringChange}
			/>
			{searchString.length ? (
				<Popover focusOnMount={false} noArrow={false}>
					<ul className={`${NAMESPACE}-post-picker-grid`}>
						{isLoading && <Spinner />}
						{!isLoading && !searchResults.length && (
							<li className={`${NAMESPACE}-post-picker-grid-item`}>
								<Button disabled>{__('No Items found', NAMESPACE)}</Button>
							</li>
						)}
						{searchResults.map((post) => {
							if (!post.title.rendered.length) {
								return null;
							}
							return (
								<li key={post.id} className={`${NAMESPACE}-post-picker-grid-item`}>
									<Button onClick={() => handleItemSelection(post)}>
										<RawHTML>{post.title.rendered}</RawHTML>
									</Button>
									<hr />
								</li>
							);
						})}
					</ul>
				</Popover>
			) : null}
		</div>
	);
};

export default PostPicker;
