# PostPicker

A simple Post Picker Component build with the core gutenberg components.

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

### Props

| Name             | Type       | Default               | Description                                                            |
| ---------------- | ---------- | --------------------- | ---------------------------------------------------------------------- |
| `onPostSelect`   | `function` | `undefined`            | Callback function that gets called with the post object upon selection |
| `label`          | `string`   | `''`                   | Renders a label for the Search Field.                                  |
| `placeholder`    | `string`   | `''`                   | Renders placeholder text inside the Search Field.                      |
| `postTypes`      | `array`    | `[ 'posts', 'pages' ]` | Names of the post types that should get searched                       |

The `postTypes` will get used like this:
```js
wp.apiFetch( {
    path: `/wp/v2/${postType}?search=${searchTerm}`
} )
```