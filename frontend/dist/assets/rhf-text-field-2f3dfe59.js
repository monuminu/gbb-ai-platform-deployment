import{j as o}from"./index-f7c4dfad.js";import{e as x,C as r}from"./rhf-autocomplete-204470f7.js";import{T as g}from"./TextField-5cd6dfc4.js";function j({name:s,helperText:u,type:a,...m}){const{control:l}=x();return o.jsx(r,{name:s,control:l,render:({field:e,fieldState:{error:t}})=>o.jsx(g,{...e,fullWidth:!0,type:a,value:a==="number"&&e.value===0?"":e.value,onChange:n=>{a==="number"?e.onChange(Number(n.target.value)):e.onChange(n.target.value)},error:!!t,helperText:t?t==null?void 0:t.message:u,...m})})}export{j as R};
