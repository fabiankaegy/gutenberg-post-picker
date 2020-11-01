import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import { InspectorControls } from '@wordpress/block-editor';
import { PanelBody, Placeholder } from '@wordpress/components';

import {PostPicker, SelectedPostPreview} from 'gutenberg-post-picker';

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
    attributes: {
        selectedPost: {
            type: 'object'
        }
    },
    transforms: {},
    variations: [],
    edit: (props) => {
        const {
            className,
            attributes: { selectedPost },
            setAttributes
        } = props;

        function handlePostSelection( post ) {
            setAttributes( { selectedPost: post } )
        }

        return (
            <>
            <InspectorControls>
                <PanelBody title={ __( 'Post Picker', NAMESPACE ) }>
                    { !!selectedPost &&
                        <SelectedPostPreview
                            label={ __( 'Currently Selected Post:', NAMESPACE ) }
                            post={ selectedPost }
                        />
                    }
                    <PostPicker 
                        label={ __( 'Select a Post or Page', NAMESPACE ) }
                        onSelectPost={ handlePostSelection }
                    />
                </PanelBody>
            </InspectorControls>
            <Placeholder label={ __( 'Post Picker', NAMESPACE ) } instructions={ __( 'Use the text field so search for a post', NAMESPACE) } className={ className }>
                <PostPicker 
                    postTypes={ [ 'pages', 'posts' ] }
                    label={ __( 'Select a Post or Page', NAMESPACE ) }
                    onSelectPost={ handlePostSelection }
                />
            </Placeholder>
            </>
        )
    },
    save: () => null
} );
