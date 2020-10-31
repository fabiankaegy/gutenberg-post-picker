# gutenberg-post-picker

This component is build using only WordPres Core Components.

## Usage

```js
import { PostPicker } from 'gutenberg-post-picker';

function MyComponent( props ) {

    return (
        <PostPicker
            onPostSelect={ console.log }
            label={ "Please select a Post or Page:" }
            postTypes={ [ 'posts', 'pages' ] }
        />
    )
}
```

## Accepted Props

### `onPostSelect` - Function that handles what happens when a post gets selected
This function gets called when an Item from the suggestions has been selected. It gets passed the `post` object as the only parameter. From this Post object you could then for example store the ID or do whatever you want with it.

### `label` - Label that is presented above the TextInput control
This label alows you to add a label to the search field. 

### `postTypes` - Override the Post Types that should be searched
You can pass an array with the names of the post types that should get searched in here. The default is: `[ 'posts', 'pages' ]`. Each of the item you put in here will be used like this: 
```js
wp.apiFetch( {
    path: `/wp/v2/${postType}?search=${searchTerm}`
} )
```