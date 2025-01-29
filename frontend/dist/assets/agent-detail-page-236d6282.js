import{v as I,a as R,r as a,y as w,j as t,S as y,B as K,p as Y,a3 as q,o as Q,i as V,d as b,E as N,h as X,aa as Z,F as tt,w as et,W as ot}from"./index-f7c4dfad.js";import{u as st}from"./use-params-075b74e1.js";import{D as it}from"./custom-gpt-chat-bench-message-item-2678e8e2.js";import{S as T}from"./index-8fda52a8.js";import{L as rt}from"./numeral-b65a1435.js";import"./knowledge-9078246a.js";import"./ChatMessageInputWebPopover-38e1844e.js";import"./markdown-e1ecb202.js";import"./image-f9ea5de7.js";import"./coming-soon-image-464dfa9d.js";import{R as at}from"./rag-source-dialog-bf54fa9f.js";import{u as nt}from"./app-gallery-78b50b87.js";import{b as ct}from"./attach-2-fill-7e40e49b.js";import{g as lt}from"./use-messages-scroll-6244af21.js";import{A as pt}from"./AppTag-7a4ee1f2.js";import{C as mt}from"./ChatWindow-19ab5a84.js";import{G as A}from"./tool-f255544f.js";import"./rhf-autocomplete-204470f7.js";import"./plus-fill-f9c9dd5d.js";import"./custom-date-range-picker-998109e2.js";import"./file-thumbnail-ebe9c7d7.js";import"./confirm-dialog-e205398d.js";import"./TextField-5cd6dfc4.js";import"./DialogContent-12fa3194.js";import"./more-horizontal-fill-3cef82a0.js";import"./arrow-ios-forward-fill-2d56b1a6.js";import"./index-491c3250.js";import"./Radio-50d033bf.js";import"./cloud-upload-fill-a41285d1.js";import"./use-light-box-1c577ab5.js";import"./rhf-text-field-2f3dfe59.js";import"./format-number-ad5a4a25.js";import"./SkeletonBoxTable-cedfa69a.js";import"./json-string-62cd4b84.js";import"./motion-container-9bab03e7.js";import"./container-3f1c2166.js";import"./Tabs-e58d3a15.js";import"./api-c77678a4.js";import"./preview-multi-file-bce21d5d.js";import"./fade-295cf198.js";import"./transition-bee6630b.js";import"./round-send-ef8614b3.js";function gt({title:r,coverUrl:s,gptContent:n}){const c={...n&&JSON.parse(n),coverUrl:s},{id:e,status:m,description:L,instruction:k,functionList:g,knowledgeBase:h,samplePrompts:B}=c;let i="open-chat",C;g&&g.length>0?i="function-calling":h&&h.length>0&&(i="rag",C=h.split("<sep>")[1]||void 0);const D=I(),d=R(),l=R(),[G,P]=a.useState(),[E,S]=a.useState([]),[F,z]=a.useState("All"),p=w(tt),u=p?p.map(o=>o.resourceName):[],x=p?p.filter(o=>o.primary):[],v=x&&x.length>0?x[0].resourceName:"";let f="";v.length>0?f=v:u&&u.length>0&&(f=u[0]);const O=w(e),U=lt(f),[j,M]=a.useState({...U,...O,[`${i.toLowerCase()}-System message`]:k}),W=o=>{M(o),Z(e,o)},_=()=>{S([])},$=a.useCallback((o,J)=>{P(o),z(J),l.onTrue()},[l]),H=D.themeLayout==="horizontal";return t.jsxs(t.Fragment,{children:[t.jsxs(y,{direction:"row",justifyContent:"space-between",alignItems:"center",sx:{mb:.5},children:[t.jsx(K,{to:Y.gbbai.gpts.root,component:q,size:"small",color:"inherit",startIcon:t.jsx(Q,{icon:ct,style:{marginRight:"-5px"}}),sx:{display:"flex"},children:"GPT store"}),t.jsxs(y,{direction:"row",alignItems:"center",children:[t.jsx(rt,{color:"default",sx:{textTransform:"None",mr:1.5},children:j[`${i}-Deployment`]||"No GPT deployment"}),t.jsx(V,{title:"Clear histroy",children:t.jsx(b,{size:"small",color:"default",onClick:_,sx:{width:36,height:36},children:t.jsx(N,{src:"/assets/icons/modules/ic-sweep.svg",sx:{width:22,height:22}})})}),t.jsx(b,{size:"small",color:"default",onClick:d.onTrue,sx:{width:36,height:36},children:t.jsx(N,{src:"/static/icons/apps/ic_settings.svg",sx:{width:20,height:20}})}),m==="draft"&&t.jsx(pt,{title:"Draft",color:"info",sx:{ml:1.5,height:24,textTransform:"none",borderRadius:.75}})]})]}),t.jsx(X,{sx:{height:H?"calc(100vh - 328px)":"calc(100vh - 204px)",display:"flex",position:"relative",overflow:"visible"},children:t.jsx(mt,{gptName:r,chatMode:i,avatarUrl:s,description:L,samplePrompts:B,messages:E,onUpdateMessages:S,configurations:j,selectedIndex:C,functionList:g,onOpenRagSourcePopover:$})}),t.jsx(it,{open:d.value,chatMode:i,onClose:d.onFalse,configurations:j,onUpdate:W}),t.jsx(at,{open:l.value,onClose:l.onFalse,ragThoughts:G,selectedSource:F})]})}const ht=t.jsx(A,{container:!0,spacing:2,sx:{px:3},children:t.jsxs(A,{item:!0,xs:12,children:[t.jsx(T,{variant:"rectangular",width:"100%",height:110,sx:{borderRadius:2,mt:.5,mb:3,px:8}}),t.jsx(T,{variant:"rectangular",width:"100%",height:"calc(100vh - 320px)",sx:{borderRadius:2,mt:.5,mb:3,px:8}})]})});function dt({id:r}){const s=I(),{apps:n,appsLoading:c}=nt(),e=n.find(m=>m.id===r);return t.jsxs(et,{maxWidth:s.themeStretch?"xl":"lg",children:[c&&ht,!c&&t.jsx(t.Fragment,{children:e&&e.source==="custom"&&t.jsx(gt,{title:e.title,gptContent:e.content,coverUrl:e.cover})})]})}function se(){const r=st(),{id:s}=r;return t.jsxs(t.Fragment,{children:[t.jsx(ot,{children:t.jsx("title",{children:" GBB/AI: Agent"})}),t.jsx(dt,{id:`${s}`})]})}export{se as default};
