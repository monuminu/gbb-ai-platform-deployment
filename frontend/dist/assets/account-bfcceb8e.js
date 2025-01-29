import{av as _,j as e,s as L,n as J,a0 as B,aS as V,aR as q,V as C,bA as U,r as p,_ as ne,bB as W,d as F,X as re,a2 as ae,Y as ie,bC as le,a as O,I as A,S as h,B as N,b as ce,T as S,C as de,M as $,o as E,l as pe,y as ue,aa as T,F as I,v as me,W as xe,w as he,p as ge,h as H,E as z}from"./index-f7c4dfad.js";import{C as fe}from"./coming-soon-image-464dfa9d.js";import{C as ye}from"./custom-breadcrumbs-4cb50d46.js";import{L as je,_ as ve}from"./plus-fill-f9c9dd5d.js";import{_ as be}from"./download-fill-5c117bbb.js";import{E as Ce}from"./image-f9ea5de7.js";import{C as Z,I as Ae,L as Se}from"./numeral-b65a1435.js";import{c as Ie,a as k,u as ke,F as we,R as Re,o as Te}from"./rhf-autocomplete-204470f7.js";import{R as M}from"./rhf-text-field-2f3dfe59.js";import{f as Me,D as Pe,c as Fe,C as Le,a as Ne,b as Oe}from"./DialogContent-12fa3194.js";import{G}from"./Grid2-f7b90094.js";import{T as _e,a as $e}from"./Tabs-e58d3a15.js";import"./TextField-5cd6dfc4.js";const Ee=_(e.jsx("path",{d:"M20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4C12.76,4 13.5,4.11 14.2, 4.31L15.77,2.74C14.61,2.26 13.34,2 12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0, 0 22,12M7.91,10.08L6.5,11.5L11,16L21,6L19.59,4.58L11,13.17L7.91,10.08Z"}),"SuccessOutlined"),ze=_(e.jsx("path",{d:"M12 5.99L19.53 19H4.47L12 5.99M12 2L1 21h22L12 2zm1 14h-2v2h2v-2zm0-6h-2v4h2v-4z"}),"ReportProblemOutlined"),Be=_(e.jsx("path",{d:"M11 15h2v2h-2zm0-8h2v6h-2zm.99-5C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"}),"ErrorOutline"),De=_(e.jsx("path",{d:"M11,9H13V7H11M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20, 12C20,16.41 16.41,20 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10, 10 0 0,0 12,2M11,17H13V11H11V17Z"}),"InfoOutlined"),Ve=["action","children","className","closeText","color","components","componentsProps","icon","iconMapping","onClose","role","severity","slotProps","slots","variant"],qe=ae(),Ue=o=>{const{variant:r,color:l,severity:s,classes:d}=o,n={root:["root",`color${B(l||s)}`,`${r}${B(l||s)}`,`${r}`],icon:["icon"],message:["message"],action:["action"]};return ie(n,le,d)},We=L(J,{name:"MuiAlert",slot:"Root",overridesResolver:(o,r)=>{const{ownerState:l}=o;return[r.root,r[l.variant],r[`${l.variant}${B(l.color||l.severity)}`]]}})(({theme:o})=>{const r=o.palette.mode==="light"?V:q,l=o.palette.mode==="light"?q:V;return C({},o.typography.body2,{backgroundColor:"transparent",display:"flex",padding:"6px 16px",variants:[...Object.entries(o.palette).filter(([,s])=>s.main&&s.light).map(([s])=>({props:{colorSeverity:s,variant:"standard"},style:{color:o.vars?o.vars.palette.Alert[`${s}Color`]:r(o.palette[s].light,.6),backgroundColor:o.vars?o.vars.palette.Alert[`${s}StandardBg`]:l(o.palette[s].light,.9),[`& .${U.icon}`]:o.vars?{color:o.vars.palette.Alert[`${s}IconColor`]}:{color:o.palette[s].main}}})),...Object.entries(o.palette).filter(([,s])=>s.main&&s.light).map(([s])=>({props:{colorSeverity:s,variant:"outlined"},style:{color:o.vars?o.vars.palette.Alert[`${s}Color`]:r(o.palette[s].light,.6),border:`1px solid ${(o.vars||o).palette[s].light}`,[`& .${U.icon}`]:o.vars?{color:o.vars.palette.Alert[`${s}IconColor`]}:{color:o.palette[s].main}}})),...Object.entries(o.palette).filter(([,s])=>s.main&&s.dark).map(([s])=>({props:{colorSeverity:s,variant:"filled"},style:C({fontWeight:o.typography.fontWeightMedium},o.vars?{color:o.vars.palette.Alert[`${s}FilledColor`],backgroundColor:o.vars.palette.Alert[`${s}FilledBg`]}:{backgroundColor:o.palette.mode==="dark"?o.palette[s].dark:o.palette[s].main,color:o.palette.getContrastText(o.palette[s].main)})}))]})}),He=L("div",{name:"MuiAlert",slot:"Icon",overridesResolver:(o,r)=>r.icon})({marginRight:12,padding:"7px 0",display:"flex",fontSize:22,opacity:.9}),Ge=L("div",{name:"MuiAlert",slot:"Message",overridesResolver:(o,r)=>r.message})({padding:"8px 0",minWidth:0,overflow:"auto"}),K=L("div",{name:"MuiAlert",slot:"Action",overridesResolver:(o,r)=>r.action})({display:"flex",alignItems:"flex-start",padding:"4px 0 0 16px",marginLeft:"auto",marginRight:-8}),Y={success:e.jsx(Ee,{fontSize:"inherit"}),warning:e.jsx(ze,{fontSize:"inherit"}),error:e.jsx(Be,{fontSize:"inherit"}),info:e.jsx(De,{fontSize:"inherit"})},Ke=p.forwardRef(function(r,l){const s=qe({props:r,name:"MuiAlert"}),{action:d,children:n,className:g,closeText:u="Close",color:m,components:x={},componentsProps:y={},icon:j,iconMapping:a=Y,onClose:c,role:t="alert",severity:i="success",slotProps:f={},slots:v={},variant:w="standard"}=s,Q=ne(s,Ve),b=C({},s,{color:m,severity:i,variant:w,colorSeverity:m||i}),R=Ue(b),D={slots:C({closeButton:x.CloseButton,closeIcon:x.CloseIcon},v),slotProps:C({},y,f)},[ee,oe]=W("closeButton",{elementType:F,externalForwardedProps:D,ownerState:b}),[se,te]=W("closeIcon",{elementType:Me,externalForwardedProps:D,ownerState:b});return e.jsxs(We,C({role:t,elevation:0,ownerState:b,className:re(R.root,g),ref:l},Q,{children:[j!==!1?e.jsx(He,{ownerState:b,className:R.icon,children:j||a[i]||Y[i]}):null,e.jsx(Ge,{ownerState:b,className:R.message,children:n}),d!=null?e.jsx(K,{ownerState:b,className:R.action,children:d}):null,d==null&&c?e.jsx(K,{ownerState:b,className:R.action,children:e.jsx(ee,C({size:"small","aria-label":u,title:u,color:"inherit",onClick:c},oe,{children:e.jsx(se,C({fontSize:"small"},te))}))}):null]}))}),Ye=Ke,Je={width:24,height:24,body:'<path fill="currentColor" d="M6 2a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6m-1 1.5L18.5 9H13m-2.95 2.22l2.83 2.83L15 11.93V19H7.93l2.12-2.12l-2.83-2.83"/>'};var Ze=Je;const Xe=["gpt-35-turbo","gpt-35-turbo-16k","gpt-35-turbo-instruct","gpt-4","gpt-4o","gpt-4-32k","text-embedding-ada-002","text-embedding-3-large","text-embedding-3-small"];function X({open:o,onClose:r,onCreate:l,onUpdate:s,onDelete:d,resource:n}){const g=O(),u=Ie().shape({resourceName:k().required("Resource name is required"),endpoint:k().required("Endpoint is required"),deployment:k().required("Deployment name is required"),model:k().required("GPT Model is required"),key:k().required("Key is required"),apiVersion:k().required("Country is required")}),m=p.useMemo(()=>({resourceName:n?n.resourceName:"",endpoint:n?n.endpoint:"",deployment:n?n.deployment:"",model:n?n.model:"",key:n?n.key:"",apiVersion:n?n.apiVersion:"2023-07-01-preview"}),[n]),x=ke({resolver:Te(u),defaultValues:m}),{handleSubmit:y,formState:{isSubmitting:j},reset:a}=x;p.useEffect(()=>{a(m)},[m,a]);const c=y(async t=>{try{l&&l({resourceName:t.resourceName,endpoint:t.endpoint,deployment:t.deployment,model:t.model,key:t.key,apiVersion:t.apiVersion,primary:n?n.primary:!1}),s&&s(n?n.resourceName:"",{resourceName:t.resourceName,endpoint:t.endpoint,deployment:t.deployment,model:t.model,key:t.key,apiVersion:t.apiVersion,primary:n?n.primary:!1}),r()}catch(i){console.error(i)}});return e.jsx(Pe,{fullWidth:!0,maxWidth:"sm",open:o,onClose:r,children:e.jsxs(we,{methods:x,onSubmit:c,children:[e.jsx(Z,{title:n?"Edit resource":"New resource",sx:{mb:3},action:n&&e.jsx(F,{color:"error",onClick:()=>{d&&(d((n==null?void 0:n.resourceName)||""),r())},children:e.jsx(A,{icon:"gravity-ui:trash-bin",width:18})})}),e.jsx(Fe,{dividers:!0,children:e.jsxs(h,{spacing:3,sx:{pt:1},children:[e.jsx(M,{name:"resourceName",label:"Resource name",placeholder:"the name of your GPT deployment"}),e.jsx(M,{name:"endpoint",label:"Endpoint",placeholder:"https://xxx.openai.azure.com/"}),e.jsx(M,{name:"deployment",label:"Deployment",placeholder:"the name of your GPT deployment"}),e.jsx(Re,{name:"model",label:"Model",placeholder:"Select a model",options:Xe.map(t=>t),getOptionLabel:t=>t,renderOption:(t,i)=>p.createElement("li",{...t,key:i},i),renderTags:(t,i)=>t.map((f,v)=>p.createElement(Le,{...i({index:v}),key:f,label:f}))}),e.jsx(M,{name:"key",label:"Key",type:g.value?"text":"password",InputProps:{endAdornment:e.jsx(Ae,{position:"end",children:e.jsx(F,{onClick:g.onToggle,edge:"end",children:e.jsx(A,{icon:g.value?"solar:eye-bold":"solar:eye-closed-bold"})})})}}),e.jsx(M,{name:"apiVersion",label:"API version",placeholder:"2023-07-01-preview, e.g."})]})}),e.jsxs(Ne,{children:[e.jsx(N,{color:"inherit",variant:"outlined",onClick:r,children:"Cancel"}),e.jsx(je,{type:"submit",variant:"contained",loading:j,children:"Save"})]})]})})}const P=L("span")(({theme:o})=>({...o.typography.caption,width:100,flexShrink:0,fontSize:13,color:o.palette.text.secondary,fontWeight:o.typography.fontWeightSemiBold}));function Qe({aoaiResource:o,onUpdateAoaiResource:r,onDeleteAoaiResource:l,onSetPrimaryAoaiResource:s,action:d,sx:n,...g}){const u=O(),m=O(),x=ce(),y=p.useCallback(()=>{x.onClose()},[x]),{resourceName:j,endpoint:a,deployment:c,key:t,model:i,primary:f,apiVersion:v}=o;return e.jsxs(e.Fragment,{children:[e.jsxs(h,{component:J,spacing:2.5,alignItems:{md:"flex-end"},direction:{xs:"column",md:"row"},sx:{position:"relative",...n},...g,children:[e.jsxs(h,{flexGrow:1,spacing:1.25,children:[e.jsxs(h,{direction:"row",alignItems:"center",sx:{mb:.5},children:[e.jsx(S,{variant:"subtitle2",children:j}),!!f&&e.jsx(Se,{color:"warning",sx:{ml:1.5},startIcon:e.jsx(A,{icon:"eva:star-fill"}),children:"Default"})]}),e.jsxs(h,{direction:"row",alignItems:"center",children:[e.jsx(P,{children:"Endpoint"}),e.jsx(S,{variant:"body2",sx:{color:"text.primary"},children:a})]}),e.jsxs(h,{direction:"row",alignItems:"center",children:[e.jsx(P,{children:"Deployment"}),e.jsx(S,{variant:"body2",sx:{color:"text.primary"},children:c})]}),e.jsxs(h,{direction:"row",alignItems:"center",children:[e.jsx(P,{children:"Model"}),e.jsx(S,{variant:"body2",sx:{color:"text.primary"},children:i})]}),e.jsxs(h,{direction:"row",alignItems:"center",children:[e.jsx(P,{children:"Key"}),e.jsx(S,{variant:"body2",sx:{color:"text.primary"},children:u.value?t:t.slice(-4).padStart(t.length,"*")}),e.jsx(F,{onClick:u.onToggle,edge:"end",sx:{p:.35,ml:1},children:e.jsx(A,{width:16,icon:u.value?"solar:eye-bold":"solar:eye-closed-bold"})})]}),e.jsxs(h,{direction:"row",alignItems:"center",children:[e.jsx(P,{children:"API version"}),e.jsx(S,{variant:"body2",sx:{color:"text.primary"},children:v})]})]}),e.jsx(h,{sx:{position:"absolute",top:8,right:8,bottom:-2},alignItems:"center",children:e.jsx(F,{onClick:w=>x.onOpen(w),children:e.jsx(A,{icon:"eva:more-vertical-fill"})})})]}),e.jsxs(de,{open:x.open,onClose:y,children:[i.includes("gpt")&&e.jsxs($,{onClick:()=>{s(j),y()},children:[e.jsx(A,{icon:"eva:star-fill",sx:{p:.1}}),"Set as primary"]}),e.jsxs($,{onClick:()=>{m.onTrue(),y()},children:[e.jsx(A,{icon:"solar:pen-bold",sx:{p:.2}}),"Edit"]}),e.jsxs($,{onClick:()=>{l&&l(j),y()},sx:{color:"error.main"},children:[e.jsx(A,{icon:"gravity-ui:trash-bin",sx:{p:.1}}),"Delete"]})]}),e.jsx(X,{open:m.value,onClose:m.onFalse,onUpdate:r,onDelete:l,resource:o})]})}function eo({aoaiResources:o,onAddNewAoaiResource:r,onUpdateAoaiResource:l,onDeleteAoaiResource:s,onDownloadAoaiResource:d,onUploadAoaiResource:n,onSetPrimaryAoaiResource:g}){const u=O();return e.jsxs(e.Fragment,{children:[e.jsxs(Oe,{children:[e.jsx(Z,{title:"Resources",sx:{pt:2.75,px:2.5},action:e.jsxs(h,{direction:"row",spacing:1,sx:{mr:1,mt:.25},children:[e.jsx(N,{size:"small",variant:"soft",color:"primary",startIcon:e.jsx(E,{icon:ve}),onClick:u.onTrue,children:"Resource"}),e.jsx(N,{size:"small",variant:"soft",color:"success",startIcon:e.jsx(E,{icon:Ze}),onClick:n,children:"Import"})]})}),o.length===0&&e.jsx(h,{spacing:2.5,sx:{p:3},children:e.jsx(Ce,{filled:!0,title:"No resources",sx:{py:10}})}),Array.isArray(o)&&o.length>0&&e.jsxs(h,{spacing:2.5,sx:{p:2.5},children:[o.map((m,x)=>e.jsx(Qe,{variant:"outlined",aoaiResource:m,onUpdateAoaiResource:l,onDeleteAoaiResource:s,onSetPrimaryAoaiResource:g,sx:{p:2,borderRadius:1}},x)),e.jsx(N,{size:"small",color:"inherit",type:"submit",variant:"contained",startIcon:e.jsx(E,{icon:be}),sx:{width:110},onClick:d,children:"Download"})]})]}),e.jsx(X,{open:u.value,onClose:u.onFalse,onCreate:r})]})}function oo(){const{enqueueSnackbar:o}=pe(),r=ue(I),l=p.useRef(null),[s,d]=p.useState(r||[]),n=p.useCallback(a=>{T(I,[...s,a])?(d(c=>[...c,a]),o("Added successfully")):o("Failed to add resource",{variant:"error"})},[s]),g=p.useCallback(a=>{if(!a||a.length===0)return;const c=s.findIndex(i=>i.resourceName===a);if(c===-1)return;const t=s.filter(i=>i.resourceName!==a);s[c].primary&&t.length>0&&(t[0].primary=!0),T(I,t)?(d(t),o("Deleted successfully")):o("Failed to delte resource",{variant:"error"})},[s]),u=p.useCallback((a,c)=>{if(!a||a.length===0)return;const t=s.findIndex(f=>f.resourceName===a);if(t===-1)return;const i=[...s];i[t]=c,T(I,i)?(d(i),o("Updated successfully")):o("Failed to update resource",{variant:"error"})},[s]),m=p.useCallback(a=>{if(!a||a.length===0)return;const c=s.findIndex(v=>v.resourceName===a);if(c===-1)return;const t=s.filter((v,w)=>w!==c).map(v=>({...v,primary:!1})),f=[{...s[c],primary:!0},...t];T(I,f)?(d(f),o("Updated successfully")):o("Failed to update resource",{variant:"error"})},[s]),x=p.useCallback(async()=>{if(s&&s.length>0){const a=`data:text/json;chatset=utf-8,${encodeURIComponent(JSON.stringify(s))}`,c=document.createElement("a");c.href=a,c.download="aoai_credentials.json",c.click()}},[s]),y=a=>{const c=new FileReader;a.target.files&&a.target.files.length>0&&(c.readAsText(a.target.files[0],"UTF-8"),c.onload=t=>{if(t.target&&t.target.result&&typeof t.target.result=="string"){const i=JSON.parse(t.target.result);if(i.length===0)return;T(I,i)?(d(i),o("Imported successfully")):o("Failed to import resources",{variant:"error"})}})},j=p.useCallback(()=>{l.current&&l.current.click()},[]);return e.jsxs(G,{container:!0,spacing:5,disableEqualOverflow:!0,children:[e.jsx(G,{xs:12,md:8,children:e.jsx(eo,{aoaiResources:s,onAddNewAoaiResource:n,onUpdateAoaiResource:u,onDeleteAoaiResource:g,onDownloadAoaiResource:x,onUploadAoaiResource:j,onSetPrimaryAoaiResource:m})}),e.jsx("input",{type:"file",ref:l,style:{display:"none"},accept:".json",onChange:y})]})}const so=[{value:"aoai",label:"AOAI",icon:e.jsx(z,{src:"/assets/icons/account/ic_aoai.svg",sx:{width:24}})},{value:"ai_search",label:"AI Search",icon:e.jsx(z,{src:"/assets/icons/account/ic_ai_search.svg",sx:{width:24}})},{value:"social",label:"Cosmos DB",icon:e.jsx(z,{src:"/assets/icons/account/ic_cosmos_db.svg",sx:{width:24}})}];function fo(){const o=me(),[r,l]=p.useState("aoai"),s=p.useCallback((n,g)=>{l(g)},[]),d=e.jsxs(h,{sx:{alignItems:"center"},children:[e.jsx(S,{variant:"h4",sx:{my:1},children:"Coming soon"}),e.jsx(S,{sx:{color:"text.secondary"},children:"We are currently working on this"}),e.jsx(fe,{sx:{my:6,height:220}})]});return e.jsxs(e.Fragment,{children:[e.jsx(xe,{children:e.jsx("title",{children:" Dashboard: Account Settings"})}),e.jsxs(he,{maxWidth:o.themeStretch?!1:"lg",children:[e.jsx(ye,{heading:"Account",links:[{name:"User",href:ge.gbbai.user.root},{name:"Account"}],sx:{mb:{xs:3,md:3}}}),e.jsxs(Ye,{variant:"outlined",severity:"info",sx:{mb:3,alignItems:"center"},children:[e.jsxs(H,{sx:{mb:1},children:["1. Your credentials will be stored only in the ",e.jsx("strong",{children:"LOCAL"})," storage of your web browser. They will be removed from local storage once you log out."]}),e.jsx(H,{children:"2. You can download the credential file to your local disk and import it the next time you log in."})]}),e.jsx(_e,{value:r,onChange:s,sx:{mb:{xs:3,md:5}},children:so.map(n=>e.jsx($e,{label:n.label,icon:n.icon,value:n.value},n.value))}),r==="aoai"&&e.jsx(oo,{}),r==="ai_search"&&d,r==="social"&&d]})]})}export{fo as default};
