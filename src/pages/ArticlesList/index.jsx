import React, { useState, useEffect,useMemo, Fragment } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { 
          Table, 
          Space,
          Card,
          message,
          Button
        } from 'antd';
import {PlusOutlined } from '@ant-design/icons';
import { history } from 'umi';
import { queryRule, updateRule, addRule } from './service';
import LinkButton from './components/link-button'

/* 获取文章 */
const fetchArticles = async (args) => {
  
  const articlesData = await queryRule(args);
  return articlesData;
 
}


const ArticlesList = () => {
    const [loading, setLoading] = useState(false);
    const [pageSize, setPageSize] = useState(10)
    const [editArticle, setEditArticle] = useState({})
    const [articles, setArticles] = useState([])
    const [total, setTotal] = useState(0)
    const [current, setCurrent] = useState(1)

    useEffect(() => {
            setLoading(true)
           fetchArticles({current, pageSize})
                .then(response => {
                  console.log('articlesData: ', response);
                  setLoading(false)
                  setTotal(response.total)
                  setArticles(response.data)
                })
                .catch(err => console.log(err))
        
    },[current])



    const columns = [
        {
          title: '标题',
          dataIndex: 'title',
          key: 'title'
        },
        {
          title: '作者',
          dataIndex: 'user',
          key: 'user',
        render: (text, record) => (<span>{text.username}</span>)
        },
        {
          title: '发布日期',
          dataIndex: 'publishDate',
          key: 'publishDate',
        },
        {
          title: '地点',
          key: 'publishCity',
          dataIndex: 'publishCity',
        },
        {
          title: '操作',
          key: 'action',
          render: (text, record) => {
            return (
                <span>
                    <LinkButton onClick={() => history.push('/articlesList/addupdate', record)}>编辑</LinkButton>
                </span>
            )
        }
        },
      ];
  
    const extra=(
      <Button type="primary" onClick={() => history.push('/articlesList/addupdate')}>
          <PlusOutlined />
          添加文章
      </Button>
    )
  return (
    <PageHeaderWrapper>
      <Card extra={extra}>
        <Table columns={columns} dataSource={articles}
              loading={loading}
              bordered={true}
              rowKey={record => record.id}
              pagination={{
                  defaultPageSize: pageSize,
                  current: current,
                  showQuickJumper: true,
                  total: total,
                  onChange: (page, pageSize) => {
                    setCurrent(page)
                  }
              }}
        />
      </Card>
    </PageHeaderWrapper>
  );
};

export default ArticlesList;
