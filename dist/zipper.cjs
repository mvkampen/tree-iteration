"use strict";var c=Object.defineProperty;var L=Object.getOwnPropertyDescriptor;var S=Object.getOwnPropertyNames;var F=Object.prototype.hasOwnProperty;var O=(e,n)=>{for(var t in n)c(e,t,{get:n[t],enumerable:!0})},P=(e,n,t,r)=>{if(n&&typeof n=="object"||typeof n=="function")for(let o of S(n))!F.call(e,o)&&o!==t&&c(e,o,{get:()=>n[o],enumerable:!(r=L(n,o))||r.enumerable});return e};var V=e=>P(c({},"__esModule",{value:!0}),e);var I={};O(I,{append:()=>G,find:()=>f,findNext:()=>q,findPrevious:()=>B,goLeft:()=>v,goNext:()=>b,goPrevious:()=>w,goRight:()=>s,goToChild:()=>a,goToFirstChild:()=>U,goToLastChild:()=>A,goToLastDecendant:()=>x,goUp:()=>d,prepend:()=>E,remove:()=>H,replace:()=>R,root:()=>m,tree:()=>_,update:()=>N,value:()=>y,zipper:()=>D});module.exports=V(I);function Z(e){return{value:e,children:[]}}function g(e,{value:n,children:t}){return{value:e(n),children:t}}function D(e){return{node:e,path:[]}}function N(e,{node:n,path:t}){return{node:g(e,n),path:t}}function R(e,n){return N(()=>e,n)}function _({node:e}){return e}function y({node:e}){return e.value}function d({node:e,path:n}){let[t,...r]=n;if(t){let{focus:o,left:i,right:u}=t;return{node:{value:o,children:[...i,e,...u]},path:r}}else return}function v({node:e,path:n}){let[t,...r]=n;if(t){let{focus:o,left:i,right:u}=t,[p,...T]=[...i].reverse();if(p){let l={focus:o,left:[...T].reverse(),right:[e,...u]};return{node:p,path:[l,...r]}}else return}else return}function s({node:e,path:n}){let[t,...r]=n;if(t){let{focus:o,left:i,right:u}=t,[p,...T]=u;if(p){let l={focus:o,left:[...i,e],right:T};return{node:p,path:[l,...r]}}else return}else return}function a(e,{node:n,path:t}){let{focus:r,left:o,right:i}=k(e,n.children);if(r){let u={focus:n.value,left:o,right:i};return{node:r,path:[u,...t]}}else return}function U(e){return a(0,e)}function A({node:e,path:n}){return a(e.children.length-1,{node:e,path:n})}function C(e){let n=d(e);if(n){let t=s(n);return t||C(n)}else return}function x(e){let n=A(e);return n?x(n):e}function b(e){return h([U,s,C],e)}function j(e){let n=v(e);if(n)return x(n)}function w(e){return h([j,d],e)}function h(e,n){let[t,...r]=e;if(t){let o=t(n);return o||h(r,n)}else return}function k(e,n){let t=n.slice(0,e),r=n[e],o=n.slice(e+1);return{focus:r,left:t,right:o}}function m(e){if(e.path.length>0){let n=d(e);return n?m(n):void 0}else return e}function f(e,n,t){let r=n(t);if(r)return e(y(r))?r:f(e,n,r)}function q(e,n){return f(e,b,n)}function B(e,n){return f(e,w,n)}function E(e,{node:n,path:t}){let[r,...o]=t,i;if(r){let{focus:u,left:p,right:T}=r;i={focus:u,left:[...p,e],right:T}}else i={focus:n.value,left:[e],right:[]};return{node:n,path:[i,...o]}}function G(e,{node:n,path:t}){let[r,...o]=t,i;if(r){let{focus:u,left:p,right:T}=r;i={focus:u,left:p,right:[e,...T]}}else i={focus:n.value,left:[],right:[e]};return{node:n,path:[i,...o]}}function H({path:e}){let[n,...t]=e;if(n){let{left:r,right:o}=n;if(o.length){let[i,...u]=o,p={focus:i.value,left:r,right:u};return{node:i,path:[p,...t]}}else if(r.length){let i=r[r.length-1],u=r.slice(0,-1),p={focus:i.value,left:u,right:o};return{node:i,path:[p,...t]}}else return{node:Z(t[0].focus),path:t}}}