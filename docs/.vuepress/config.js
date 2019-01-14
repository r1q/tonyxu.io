module.exports = {
  
  head: [
    ['link', { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' }],
    ['link', { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' }],
    ['link', { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' }],
    ['link', { rel: 'manifest', href: '/site.webmanifest' }],
    ['meta', { name: 'msapplication-TileColor', content: '#da532c'}],
    ['meta', { name: 'theme-color', content: '#ffffff'}]
  ],
  ga: "UA-577792-7",
  locales: {
    '/': {
      lang: 'en-US',
      title: 'Tony Xu Blog',
      description: 'A LinkedIn software engineer, loves to build things',
    },
    '/zh/': {
      lang: 'zh-CN',
      title: 'Tony Xu (徐毅涵) 博客',
      description: 'LinkedIn领英软件工程师, 热爱编程',

    }
  },
  serviceWorker: true,
  themeConfig: {
    repo: 'tonyxu-io/my-blog',
    editLinks: true,
    sidebar: 'auto',
    locales: {
      '/': {
        nav: [
          { text: 'Home', link: '/' },
          { text: 'Posts', link: '/posts/' },
          { text: "About", link: '/about/'},
          { text: "Friends", link: '/friends/'}
        ],
        selectText: 'Languages',
        label: 'English',
        readArticleText: 'Read article',
      },
      '/zh/': {
        nav: [
          { text: '主页', link: '/zh/' },
          { text: '文章', link: '/zh/posts/' },
          { text: "关于", link: '/zh/about/'},
          { text: "链接", link: '/friends/'}
        ],
        selectText: '语言',
        label: '中文',
        readArticleText: '阅读全文',
      }
    }
    
  },
  plugins: [
    ['@vuepress/pwa',
    { 
      serviceWorker: true,
      updatePopup: true
    }],'@vuepress/medium-zoom'
  ]
  // plugins: ['@vuepress/blog'],
  // permalink: '/:slug'
}