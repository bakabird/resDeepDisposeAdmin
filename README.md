数据结构设计:
  综艺:
    综艺编号:
      (primay)
    EP:
      (primay)
    综艺名:
    DATE:
    mainUrl:
  其他综艺资源:
    综艺编号:
      (primay)
    EP:
      (primay)
    URL:
    Name:


排序算法：专辑 > 团综 > 典礼  > 综艺 > 舞台 > 直播 > 电台 > 配料

字条夹子实现
1. 在原基础上，添加一个字段(itemType)，一个是'note',一个是'clamp',一个是'riddle'
2. note即笔记，即字条，即一般的资源项目
3. clamp是夹子，将会囊括note,被囊括的note不会向外显露
4. riddle是谜语，即指示他人前去某种地方的收集盒，同样能够囊括note，但被囊括的note仍旧会对外显露

clamp可以包括clamp么？