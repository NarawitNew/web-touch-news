import 'froala-editor/js/plugins.pkgd.min.js'
import 'froala-editor/css/froala_style.min.css'
import 'froala-editor/css/froala_editor.pkgd.min.css'

import React, { useState } from 'react'

import FroalaEditor from 'react-froala-wysiwyg'
import FroalaEditorView from 'react-froala-wysiwyg/FroalaEditorView';

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
      },
      'image.uploaded': function (response) {
        response = JSON.parse(response);
        let images = image
        images.push(response.url)
        setImage(images)
        props.setImageContent(image)
      },
      'image.inserted': function ($img, response) {
      },
      'image.replaced': function ($img, response) {
      }
    }
  }

  return (
    <div >
      <FroalaEditor
        model={props.mode}
        onModelChange={props.onModelChange}
        config={config}
        tag="textarea"
      />
    </div>
  )
}



