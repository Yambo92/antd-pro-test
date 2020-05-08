import React, {useState, forwardRef, useImperativeHandle} from 'react';
import { Editor } from 'react-draft-wysiwyg';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';

const RichTextEditor = forwardRef((props, ref) => {
    const [editorState, seteditorState] = useState(() => {
        if(props.detail){
            const blocksFromHtml = htmlToDraft(props.detail);
            const { contentBlocks, entityMap } = blocksFromHtml;
            const contentState = ContentState.createFromBlockArray(contentBlocks, entityMap);
            return EditorState.createWithContent(contentState);
        }else{
            return EditorState.createEmpty()
        }
    });
    const onEditorStateChange = (editorState) => {
        seteditorState(editorState)
    }
    //获取标签结果
    useImperativeHandle(ref, () => ({
         getDetail(){
            return draftToHtml(convertToRaw(editorState.getCurrentContent()))
        }
   }))
   const uploadImageCallBack = (file) => {
    return new Promise(
      (resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', '/manage/img/upload');
        xhr.setRequestHeader('Authorization', 'Client-ID XXXXX');
        const data = new FormData();
        data.append('image', file);
        xhr.send(data);
        xhr.addEventListener('load', () => {
          const response = JSON.parse(xhr.responseText);
          const url = response.data.url //得到图片地址
          resolve({data: {link: url}});
        });
        xhr.addEventListener('error', () => {
          const error = JSON.parse(xhr.responseText);
          reject(error);
        });
      }
    );
  }
    return (
            <Editor
                editorState={editorState}
                toolbarClassName="toolbarClassName"
                wrapperClassName="wrapperClassName"
                editorClassName="editorClassName"
                editorStyle={{border: "1px solid #999", minHeight:200, maxHeight:500, padding:10}}
                onEditorStateChange={onEditorStateChange}
                toolbar={{
                    list: { inDropdown: true },
                    textAlign: { inDropdown: true },
                    link: { inDropdown: true },
                    history: { inDropdown: true },
                    // image: { uploadCallback: uploadImageCallBack },
                  }}
            />                  
    );
})

export default RichTextEditor;