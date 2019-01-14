---
title: "自己写脚本每日爬取租房价格推送到手机"
date: 2018-07-28
description: "在硅谷生活工作，租房是一个很重要的事情。在硅谷或者美国其他地方租房，很多人像我一样选择专门的出租公寓，这种公寓只租不卖，经营也比较专业化。大部分出租公寓会有官网可以查询价格/空房，并且可以在线签约，规模小一些的出租公寓可能就没有官网，租房信息只挂在第三方租房网站上。由于我和女票一个刚换新公司，一个即将要去新公司，因此物色好了一处公寓，准备过几个月入住。由于这处公寓的在线价格每天都在变化，因此自己写了一个脚本每天查询所有可供签约的房间价格和其他信息并推送到手机，以供参考。下面记录了一些我实现的过程。"
---

# 自己写脚本每日爬取租房价格推送到手机

在硅谷生活工作，租房是一个很重要的事情。在硅谷或者美国其他地方租房，很多人像我一样选择专门的出租公寓，这种公寓只租不卖，经营也比较专业化。大部分出租公寓会有官网可以查询价格/空房，并且可以在线签约，规模小一些的出租公寓可能就没有官网，租房信息只挂在第三方租房网站上。由于我和女票一个刚换新公司，一个即将要去新公司，因此物色好了一处公寓，准备过几个月入住。由于这处公寓的在线价格每天都在变化，因此自己写了一个脚本每天查询所有可供签约的房间价格和其他信息并推送到手机，以供参考。下面记录了一些我实现的过程。

## 简介

这家公寓是个专业连锁出租公寓，为了避免暴露我的住址，以下均以其旗下另一处出租公寓举例。

这家连锁公寓的官网是: 

https://www.avaloncommunities.com/california/mountain-view-apartments/avalon-mountain-view/floor-plans

官网价格区截图:

![](./2018_07_28_22_50_27.png)

## 分析

为了每天能自动接收这座公寓的价格信息，这个脚本大概需要做如下几件事:

1. 脚本自动抓取所有待租公寓房间的价格、大小、入住日期、及其他重要信息
2. 提取如上信息拼接消息文本，并发送给自己(我通过Telegram Bot给自己推送消息来接收通知, 参考另一篇文章:[利用Telegram和Flask打造私人通知服务器](/zh/posts/2018/use-telegram-and-flask-to-build-notification-server/))

## 实现

一开始我准备用爬虫爬网页文本，并分析文本提取价格信息。但是转念一想我应该先查看网站是不是自己有API提供这些信息给前端，打开Chrome Inspect网络，发现确实有这个API通过GET请求获取这些信息。为了确保这个API不需要鉴权一类验证，我复制API网址在隐身窗口打开，同样可以拿到数据。因此实现方法应该是让脚本发一个GET请求触发推送出租信息。

Chrome Inspector:

![](./2018_07_28_23_02_23.png)

经过仔细研究后，发现这个获取租房信息的GET请求本身还支持一些参数，如最低价格，最高价格，预期入住日期等。

接下来就是代码实现了，因为我已经有一个python Flask app跑在Google App Engine上，因此就基于之前的app加了一段代码，通过url(如 http://example.com/housing )访问触发脚本执行。定时发送请求触发脚本的方法请参阅[用GitLab-CI免费运行定时任务](/zh/posts/2018/use-gitlab-ci-to-run-free-scheduled-jobs/)

## 代码

### Flask脚本片段

```python
@app.route('/housing', methods=['GET'])
def housing():
    houseResponse = json.loads(urlfetch.fetch(url='https://api.avalonbay.com/json/reply/ApartmentSearch?communityCode=CA049&min=2000&max=3000&desiredMoveInDate=2018-09-01T07:00:00.000Z').content)
    availableFloorPlans = houseResponse["results"]["availableFloorPlanTypes"][0]["availableFloorPlans"]
    responseText = "*House Quotes:*%0A"
    for availableFloorPlan in availableFloorPlans:
        for apartment in availableFloorPlan["finishPackages"][0]["apartments"]:
            responseText += "Size:" + str(apartment["apartmentSize"]) + " Price:" + str(apartment["pricing"]["effectiveRent"]) + " Floor:" + str(apartment["floor"]) + " Date:" + time.strftime('%Y-%m-%d', time.localtime(float(filter(str.isdigit, str(apartment["pricing"]["availableDate"])))/1000)) + "%0A"
    requestUrl = config.telegramWebHookURI + "/sendMessage?parse_mode=Markdown&chat_id=123456789" + "&text=" + responseText
    urlfetch.fetch(url=requestUrl).content
    return responseText
```

### GitLab-CI

GitLab-CI配置文件(gitlab-ci.yml):


```yml
test:
  script:
    - bash scripts/get_quotes.sh
```

GitLab-CI运行脚本(get_quotes.sh):

```sh
#!/bin/sh
curl https://api.tonyxu.io/housing
```

## 效果预览

<img width="50%" style="min-width:300px" src="./2018_07_28_23_35_59.png">