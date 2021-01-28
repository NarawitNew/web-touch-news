import 'froala-editor/js/plugins.pkgd.min.js'
import 'froala-editor/css/froala_style.min.css'
import 'froala-editor/css/froala_editor.pkgd.min.css'

import FroalaEditor from 'react-froala-wysiwyg'
import React from 'react'

// Require Editor plugin files.
// Require Editor CSS files.

const Froala = (props) => {
  return (
    <div >
      <FroalaEditor onModelChange={props.onModelChange} tag="textarea" />
    </div>
  )
}
export default Froala


