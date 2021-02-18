import 'froala-editor/js/plugins.pkgd.min.js'
import 'froala-editor/css/froala_style.min.css'
import 'froala-editor/css/froala_editor.pkgd.min.css'

import React, { useState } from 'react'

import FroalaEditor from 'react-froala-wysiwyg'
import FroalaEditorView from 'react-froala-wysiwyg/FroalaEditorView';

// Require Editor plugin files.
// Require Editor CSS files.

export const FroalaView = (props) => {
  return (
    <FroalaEditorView
      model={props.model}
    />
  );
}

export const Froala = (props) => {
  const [image, setImage] = useState([])
  const config = {
    imageUploadParam: 'sampleFile',
    imageUploadURL: "https://media.devhubbravo.com/api/v1/upload",
    imageUploadParams: {
      save: 'false',
    },
    imageUploadMethod: 'POST',
    imageMaxSize: 2 * 1024 * 1024,
    imageAllowedTypes: ['jpeg', 'jpg', 'png', 'gif'],

    events: {
      'image.beforeUpload': function (images) {
        // Return false if you want to stop the image upload.
      },
      'image.uploaded': function (response) {
        // Image was uploaded to the server.
        response = JSON.parse(response);
        let images = image
        images.push(response.url)
        setImage(images)
        props.setImageContent(image)
      },
      'image.inserted': function ($img, response) {
        // Image was inserted in the editor.
      },
      'image.replaced': function ($img, response) {
        // Image was replaced in the editor.

      }
    }

  }

  return (
    <div >
      <FroalaEditor onModelChange={props.onModelChange} config={config} tag="textarea" />
    </div>
  )
}



