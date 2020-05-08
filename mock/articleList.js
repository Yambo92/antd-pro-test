import { parse } from 'url'
const Mock = require('mockjs')
let Random = Mock.Random
/* articles
[
    {
        id: '1',
        title: "文章标题",
        publishDate: "2020-05-07 19:00:00",
        publishCity: '湖北 武汉',
        content: '富文本',
        username: 'admin',
        userId: '01'

    }
]
*/
const mockCity = [
    '湖北 武汉',
    '湖北 黄冈',
    '湖北 襄阳',
    '湖北 十堰',
    '河南 郑州',
    '河南 商丘',
    '河南 驻马店',
    '河南 南阳',
    '北京 朝阳区',
]
const genList = (current, pageSize) => {
    const articlesDataSource = [];

    for(let i = 0; i < pageSize; i++) {
        const index = ( current - 1)*10 + i;
        articlesDataSource.push({
            id: `${index}`,
            title: Random.ctitle(8, 15),
            publishDate: Random.datetime(),
            publishCity: mockCity[Math.floor(Math.random() * 9)],
            content: Random.cparagraph(),
            user: [
                {username:'admin', userId: '01'},
                {username:'user1', userId: '02'},
                {username:'user2', userId: '03'},
                {username:'user3', userId: '04'},
               ][Math.floor(Math.random()*4)],
        })
    }

    return articlesDataSource;
};

let articlesDataSource = genList(1, 50);

function getArticles(req, res, u) {
    let realUrl = u;
    if (!realUrl || Object.prototype.toString.call(realUrl) !== '[object String]') {
        realUrl = req.url;
    };

    const { current=1, pageSize=10} = req.query;
    const params = parse(realUrl, true).query;
    let dataSource = [...articlesDataSource].slice((current - 1) * pageSize, current * pageSize);

    if(params.sorter){
        const s = params.sorter.split('_');
        dataSource = dataSource.sort((prev, next) => {
            if(s[1] === 'descend') {
                return next[s[0]] - prev[s[0]];
            };
            return prev[s[0]] - next[s[0]];
        })
    }
    const result = {
        data: dataSource,
        total: articlesDataSource.length,
        success: true,
        pageSize,
        current: parseInt(`${params.currentPage}`, 10) || 1,
    };
    return res.json(result);

};

function postArticle(req, res, u, b) {
    let realUrl = u;
    if (!realUrl || Object.prototype.toString.call(realUrl) !== '[object String]') {
        realUrl = req.url;
    }

    const body = (b && b.body) || req.body;
    const { method, title, user, content, publishCity, publishDate, id } = body;
    switch (method) {
        case 'post':
            (() => {
                const i = Math.ceil(Math.random() * 10000);
                const newArticle = {
                    id: `${articlesDataSource.length}`,
                    title: title || Random.ctitle(8, 15),
                    publishDate: publishDate || Random.datetime(),
                    publishCity: publishCity || mockCity[Math.floor(Math.random() * 9)],
                    content: content || Random.cparagraph(),
                    user:  user ? user : [
                        {username:'admin', userId: '01'},
                        {username:'user1', userId: '02'},
                        {username:'user2', userId: '03'},
                        {username:'user3', userId: '04'},
                       ][Math.floor(Math.random()*4)],
                    };
                articlesDataSource.unshift(newArticle)
                return res.json(newArticle)
            })();
            return;
        case 'update':
            (() => {
                let newArticle = {};
                articlesDataSource = articlesDataSource.map(item => {
                    if(item.id === id) {
                        newArticle = {...item, title, publishDate, publishCity, content};
                        return newArticle
                    }
                    return item;
                });
                return res.json(newArticle)
            })();
            return;
            default:
                break;
    }
    const result = {
        list: articlesDataSource,
        pagination: {
            total: articlesDataSource.length
        }
    };
    res.json(result);
}

function cityList(req, res, u) {
    let citylist = [
        {
            value: '湖北',
            label: '湖北',
            children: [
                {
                    value: '武汉',
                    label: '武汉',
                }, {
                    value: '黄冈',
                    label: '黄冈',
                }, {
                    value: '襄阳',
                    label: '襄阳',
                }, {
                    value: '十堰',
                    label: '十堰',
                },
            ]
        },
        {
            value: '河南',
            label: '河南',
            children: [
                {
                    value: '郑州',
                    label: '郑州',
                }, {
                    value: '商丘',
                    label: '商丘',
                }, {
                    value: '驻马店',
                    label: '驻马店',
                }, {
                    value: '南阳',
                    label: '南阳',
                },
            ]
               
        },
        {
            value: '北京',
            label: '北京',
            children: [
                {
                label: '朝阳区',
                value: '朝阳区',
                }
            ]
        }
       
    ];
    let realUrl = u;
    if (!realUrl || Object.prototype.toString.call(realUrl) !== '[object String]') {
        realUrl = req.url;
    }
    res.json(citylist);
}

export default {
    'GET /api/articles': getArticles,
    'GET /api/cityList': cityList,
    'POST /api/article': postArticle
};