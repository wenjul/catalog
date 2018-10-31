## 适用场景

用于表格底部，用于表格单页可显示列数，表格整体显示行总数，和翻页的控制，可根据业务的需求来进行选用，通常与表格一起使用。

```html
dark: true
frameStyles: ['http://119.29.8.64/open_proj/proj_qcloud_v2/bee-ui-docs/catalog/compatible.css']
frameScripts: ['https://cdn.bootcss.com/jquery/3.3.1/jquery.slim.min.js']
---
<div class="tc-15-page">
    <div class="tc-15-page-state"><span class="tc-15-page-text">已选<strong>6</strong>项，共<strong>270</strong>项</span>
    </div>
    <div class="tc-15-page-operate"><span class="tc-15-page-text">每页显示行</span>

        <div class="tc-15-page-select tc-15-page-selected"><a href="javascript:;" class="indent">15<span class="ico-arrow"></span></a>
            <ul class="tc-15-simulate-option tc-15-def-scroll" style="visibility: visible">
                <li tabindex="0">3334</li>
                <li tabindex="0">200</li>
                <li tabindex="0">20</li>
                <li tabindex="0">25</li>
                <li tabindex="0">30</li>
                <li tabindex="0">30</li>
                <li tabindex="0">30</li>
            </ul>
        </div>
        <a href="javascript:;" title="第一页" class="tc-15-page-first disable"></a>
        <a href="javascript:;" title="上一页" class="tc-15-page-pre disable"></a>

        <div class="tc-15-page-select tc-15-page-selected"><a href="javascript:;" class="tc-15-page-num">1/30<span class="ico-arrow"></span></a>
            <ul class="tc-15-simulate-option tc-15-def-scroll" style="visibility: visible">
                <li tabindex="0">10</li>
                <li tabindex="0">15</li>
                <li tabindex="0">20</li>
                <li tabindex="0">25</li>
                <li tabindex="0">30</li>
                <li tabindex="0">30</li>
                <li tabindex="0">30</li>
            </ul>
        </div>
        <a href="javascript:;" title="下一页" class="tc-15-page-next"></a>
        <a href="javascript:;" title="最后一页" class="tc-15-page-last"></a>
    </div>
</div>
```

## 简版翻页

适用于对话框内的表格等翻页（大结构不变，只是在默认基础上删减不用的节点）

```html
frameStyles: ['http://119.29.8.64/open_proj/proj_qcloud_v2/bee-ui-docs/catalog/compatible.css']
---
<p>But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born and I will give you a complete account of the system, and expound the actual teachings of the great explorer of the truth, the master-builder of human happiness. No one rejects, dislikes, or avoids pleasure itself, because it is pleasure, but because those who do not know how to pursue pleasure rationally encounter consequences that are extremely painful. Nor again is there anyone who loves or pursues or desires to obtain pain of itself, because it is pain, but because occasionally circumstances occur in which toil and pain can procure him some great pleasure. To take a trivial example, which of us ever undertakes laborious physical exercise, except to obtain some advantage from it? But who has any right to find fault with a man who chooses to enjoy a pleasure that has no annoying consequences, or one who avoids a pain that produces no resultant pleasure?</p>
<div class="tc-15-page">
    <div class="tc-15-page-state"><span class="tc-15-page-text">已选<strong>6</strong>项，共<strong>270</strong>项</span>
    </div>
    <div class="tc-15-page-operate">
        <a href="javascript:;" title="第一页" class="tc-15-page-first disable"></a>
        <a href="javascript:;" title="上一页" class="tc-15-page-pre disable"></a>
        <div class="tc-15-page-select tc-15-page-selected"><a href="javascript:;" class="tc-15-page-num">1/30<span class="ico-arrow"></span></a>
            <ul class="tc-15-simulate-option tc-15-def-scroll" style="visibility: visible">
                <li tabindex="0">10</li>
                <li tabindex="0">15</li>
                <li tabindex="0">20</li>
                <li tabindex="0">25</li>
                <li tabindex="0">30</li>
                <li tabindex="0">30</li>
                <li tabindex="0">30</li>
            </ul>
        </div>
        <a href="javascript:;" title="下一页" class="tc-15-page-next"></a>
        <a href="javascript:;" title="最后一页" class="tc-15-page-last"></a>
    </div>
</div>
```

## 左右翻页

适用于监控视图实例切换等

```html
plain: false
frameStyles: ['https://imgcache.qq.com/open_proj/proj_qcloud_v2/bee-v2/css/bee.css']
---
<div class="pagination">
    <a href="javascript:;" class="btn-page page-prev btn-page-disabled" title="上一条"><i class="icon-page-prev"></i></a>
    <a href="javascript:;" class="btn-page page-next" title="下一条"><i class="icon-page-next"></i></a>
</div>
```
