import{s as I,V as a,r,U as x,_ as p,af as u,j as f,X as g,Y as L,ag as d}from"./index-f7c4dfad.js";const S=["className"],v=s=>{const{alignItems:t,classes:e}=s;return L({root:["root",t==="flex-start"&&"alignItemsFlexStart"]},d,e)},C=I("div",{name:"MuiListItemIcon",slot:"Root",overridesResolver:(s,t)=>{const{ownerState:e}=s;return[t.root,e.alignItems==="flex-start"&&t.alignItemsFlexStart]}})(({theme:s,ownerState:t})=>a({minWidth:56,color:(s.vars||s).palette.action.active,flexShrink:0,display:"inline-flex"},t.alignItems==="flex-start"&&{marginTop:8})),R=r.forwardRef(function(t,e){const o=x({props:t,name:"MuiListItemIcon"}),{className:i}=o,c=p(o,S),l=r.useContext(u),n=a({},o,{alignItems:l.alignItems}),m=v(n);return f.jsx(C,a({className:g(m.root,i),ownerState:n,ref:e},c))}),j=R;export{j as L};
