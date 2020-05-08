import React, {useState, useEffect, useRef} from 'react'
import {ArrowLeftOutlined } from '@ant-design/icons';
import {
    Card,
    Form,
    Input,
    Cascader, 
    Button,
    message,
    DatePicker,
    notification
} from 'antd';

import 'react-quill/dist/quill.snow.css';
import RichTextEditor from './RichTextEditor'
import LinkButton from './link-button'
import { history } from 'umi';
import moment from 'moment'
import { updateRule, addRule, cityRule } from '../service';

const {TextArea} = Input;

const ArticleAddUpdate = (props) => {
    console.log('编辑',props.location.state)
    const [options, setoptions] = useState([]); //选择框
    const [content, setContent] = useState(''); //富文本
    const [title, setTitle] = useState('');
    const [article, setArticle] = useState(props.location.state || {});

    const richTextEditorRef = useRef();
    let cityList = [];
    let isUpdate = !!props.location.state //判断location中是否有state来判断是否是更新还是添加
    if(isUpdate){//更新
        cityList = article.publishCity.split(' ')
    }
    const cardtitle=(
        <span>
            <LinkButton>
                <ArrowLeftOutlined 
                    style={{marginRight:"10px"}}
                    onClick={() => {history.goBack()}}
                />
            </LinkButton>
            <span>{isUpdate ? "修改文章" : '添加文章'}</span>
        </span>
    )
   
    useEffect(() => {
        const fetchCity = async() => {
            const result = await cityRule()
            setoptions(result)
        }
        fetchCity();
    }, [])

    const layout = {
        labelCol: {span:4}, //左侧label的宽度
        wrapperCol: {span:8} //右侧控件包裹的宽度
    }
  
    const onChange = (value, selectedOptions) => {
        console.log(value, selectedOptions);
      };
    const handleDate = (date, dateString) => {
        console.log(date, dateString);
      }
    const onFinish= async (values) => {
        let publishDate = moment().format('YYY-MM-DD h:mm:ss');
        const content = richTextEditorRef.current.getDetail();
        const publishCity = values.publishCity.join(' ')
        if(isUpdate){//调用更新接口
            let id = article.id;
            try{
                const result = await updateRule({...values, publishCity, content, publishDate, id })
                message.success('更新成功！')
                history.goBack()

            }catch(err){
                console.log(err)
            }
        }else{//调用新增接口
            try{
                const result = await addRule({...values, publishDate, content, publishCity})
                message.success('发布成功！')
                history.goBack()
            }catch(err){
                message.error('发布失败！')

            }
            
        }
    }
    const onFinishFailed = errorInfo => {
        console.log('Failed: 校验失败');
        };
   
        
    const  prompt = () => {
        const content =  richTextEditorRef.current.getDetail();
        notification.open({
            message: '文章内容:',
            description: <span dangerouslySetInnerHTML={{ __html: content }} />,
        });
        };
    return (
        <Card title={cardtitle}>
            <Form {...layout} onFinish = {onFinish} onFinishFailed={onFinishFailed}
               initialValues={{
                   title: article.title,
                   content: article.content,
                    publishDate: article.publishDate ? moment(article.publishDate, 'YYYY-MM-DD HH:mm:ss') : moment(moment(), 'YYYY-MM-DD HH:mm:ss'),

                   publishCity: cityList || ["湖北", "武汉"],
               }}
            >
                <Form.Item 
                name="title"
                label="标题"
                rules={[{required: true, message: "标题不能为空"}]}>
                    <Input placeholder="请输入标题" />
                </Form.Item>
                <Form.Item 
                    name="publishCity"
                    label="发布地点" 
                    rules={[{required: true, message: "发布地点不能为空"}]}>
                   <Cascader
                        options={options}
                        onChange={onChange}
                        placeholder='请选择地点'                        
                    />
                </Form.Item>
                <Form.Item 
                    name="publishDate"
                    label="发布时间" 
                    rules={[{required: true, message: "发布时间不能为空"}]}>
                      <DatePicker
                        style={{
                            width: '100%',
                        }}
                        format="YYYY-MM-DD HH:mm:ss"
                        placeholder="选择发布时间"
                        onChange={handleDate} 
                    />
                </Form.Item>
                <Form.Item 
                    name="content"
                    // labelCol={{span:2}}
                     wrapperCol={{span:24}}
                    >
                    <RichTextEditor ref={richTextEditorRef}  detail={article.content} />                    
                </Form.Item>
                <Form.Item>
                        <Button type="primary" htmlType="submit">发布</Button>
                        {/* <Button style={{ marginLeft: 26 }} onClick={prompt}>
                            预览
                       </Button> */}
                </Form.Item>
            </Form>
        </Card>
    );
}

export default ArticleAddUpdate;