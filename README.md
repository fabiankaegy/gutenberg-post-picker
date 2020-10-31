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