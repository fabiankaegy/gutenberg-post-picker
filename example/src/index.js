import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';

import PostPicker from 'gutenberg-post-picker';

const NAMESPACE = 'example';

registerBlockType( `${ NAMESPACE }/hello-world`, {
    title: __( 'Hello World', NAMESPACE ),
    description: __( 'Example Block to show the Post Picker in usage', NAMESPACE ),
    icon: 'smiley',
    category: 'common',
    example: {},
    supports: {
        html: false
    },
    attributes: {},
    transforms: {},
    variations: [],
    edit: (props) => {
        const {
            className,
        } = props;

        function handlePostSelection( selectedPost ) {
            console.log( selectedPost );
        }

        return (
            <div className={ className }>
                <PostPicker 
                    label={ __( 'Select a Post or Page', NAMESPACE ) }
                    onSelectPost={ handlePostSelection }
                />
            </div>
        )
    },
    save: () => null
} );
