
/* eslint-env serviceworker */
/* global clients, firebase, importScripts */

// Cache-Control: no-cache
// Content-Type: application/javascript
// Service-Worker-Allowed: /

// Load Firebase essentials first
// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here.
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

// Firebase configuration for service worker
// Initialize the Firebase app in the service worker
firebase.initializeApp({
  apiKey: 'VITE_FIREBASE_API_KEY',
  authDomain: 'VITE_FIREBASE_AUTH_DOMAIN',
  projectId: 'VITE_FIREBASE_PROJECT_ID',
  storageBucket: 'VITE_FIREBASE_STORAGE_BUCKET',
  messagingSenderId: 'VITE_FIREBASE_MESSAGING_SENDER_ID',
  appId: 'VITE_FIREBASE_APP_ID'
});

const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/images/notification-icon.png',
    badge: '/images/badge-icon.png',
    tag: 'geaux-academy-notification',
    data: payload.data
  };

  return self.registration.showNotification(notificationTitle, notificationOptions);
});
var Sd=function(n){let e=[],t=0;for(let r=0;r<n.length;r++){let i=n.charCodeAt(r);i<128?e[t++]=i:i<2048?(e[t++]=i>>6|192,e[t++]=i&63|128):(i&64512)===55296&&r+1<n.length&&(n.charCodeAt(r+1)&64512)===56320?(i=65536+((i&1023)<<10)+(n.charCodeAt(++r)&1023),e[t++]=i>>18|240,e[t++]=i>>12&63|128,e[t++]=i>>6&63|128,e[t++]=i&63|128):(e[t++]=i>>12|224,e[t++]=i>>6&63|128,e[t++]=i&63|128)}return e},J_=function(n){let e=[],t=0,r=0;for(;t<n.length;){let i=n[t++];if(i<128)e[r++]=String.fromCharCode(i);else if(i>191&&i<224){let s=n[t++];e[r++]=String.fromCharCode((i&31)<<6|s&63)}else if(i>239&&i<365){let s=n[t++],a=n[t++],c=n[t++],u=((i&7)<<18|(s&63)<<12|(a&63)<<6|c&63)-65536;e[r++]=String.fromCharCode(55296+(u>>10)),e[r++]=String.fromCharCode(56320+(u&1023))}else{let s=n[t++],a=n[t++];e[r++]=String.fromCharCode((i&15)<<12|(s&63)<<6|a&63)}}return e.join("")},Rd={byteToCharMap_:null,charToByteMap_:null,byteToCharMapWebSafe_:null,charToByteMapWebSafe_:null,ENCODED_VALS_BASE:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",get ENCODED_VALS(){return this.ENCODED_VALS_BASE+"+/="},get ENCODED_VALS_WEBSAFE(){return this.ENCODED_VALS_BASE+"-_."},HAS_NATIVE_SUPPORT:typeof atob=="function",encodeByteArray(n,e){if(!Array.isArray(n))throw Error("encodeByteArray takes an array as a parameter");this.init_();let t=e?this.byteToCharMapWebSafe_:this.byteToCharMap_,r=[];for(let i=0;i<n.length;i+=3){let s=n[i],a=i+1<n.length,c=a?n[i+1]:0,u=i+2<n.length,d=u?n[i+2]:0,f=s>>2,g=(s&3)<<4|c>>4,b=(c&15)<<2|d>>6,R=d&63;u||(R=64,a||(b=64)),r.push(t[f],t[g],t[b],t[R])}return r.join("")},encodeString(n,e){return this.HAS_NATIVE_SUPPORT&&!e?btoa(n):this.encodeByteArray(Sd(n),e)},decodeString(n,e){return this.HAS_NATIVE_SUPPORT&&!e?atob(n):J_(this.decodeStringToByteArray(n,e))},decodeStringToByteArray(n,e){this.init_();let t=e?this.charToByteMapWebSafe_:this.charToByteMap_,r=[];for(let i=0;i<n.length;){let s=t[n.charAt(i++)],c=i<n.length?t[n.charAt(i)]:0;++i;let d=i<n.length?t[n.charAt(i)]:64;++i;let g=i<n.length?t[n.charAt(i)]:64;if(++i,s==null||c==null||d==null||g==null)throw new Ua;let b=s<<2|c>>4;if(r.push(b),d!==64){let R=c<<4&240|d>>2;if(r.push(R),g!==64){let k=d<<6&192|g;r.push(k)}}}return r},init_(){if(!this.byteToCharMap_){this.byteToCharMap_={},this.charToByteMap_={},this.byteToCharMapWebSafe_={},this.charToByteMapWebSafe_={};for(let n=0;n<this.ENCODED_VALS.length;n++)this.byteToCharMap_[n]=this.ENCODED_VALS.charAt(n),this.charToByteMap_[this.byteToCharMap_[n]]=n,this.byteToCharMapWebSafe_[n]=this.ENCODED_VALS_WEBSAFE.charAt(n),this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[n]]=n,n>=this.ENCODED_VALS_BASE.length&&(this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(n)]=n,this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(n)]=n)}}},Ua=class extends Error{constructor(){super(...arguments),this.name="DecodeBase64StringError"}},X_=function(n){let e=Sd(n);return Rd.encodeByteArray(e,!0)},Ur=function(n){return X_(n).replace(/\./g,"")},os=function(n){try{return Rd.decodeString(n,!0)}catch(e){console.error("base64Decode failed: ",e)}return null};function Z_(){if(typeof self<"u")return self;if(typeof window<"u")return window;if(typeof global<"u")return global;throw new Error("Unable to locate global object.")}var ey=()=>Z_().__FIREBASE_DEFAULTS__,ty=()=>{if(typeof process>"u"||typeof process.env>"u")return;let n=process.env.__FIREBASE_DEFAULTS__;if(n)return JSON.parse(n)},ny=()=>{if(typeof document>"u")return;let n;try{n=document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/)}catch{return}let e=n&&os(n[1]);return e&&JSON.parse(e)},as=()=>{try{return ey()||ty()||ny()}catch(n){console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${n}`);return}},qa=n=>{var e,t;return(t=(e=as())===null||e===void 0?void 0:e.emulatorHosts)===null||t===void 0?void 0:t[n]},cs=n=>{let e=qa(n);if(!e)return;let t=e.lastIndexOf(":");if(t<=0||t+1===e.length)throw new Error(`Invalid host ${e} with no separate hostname and port!`);let r=parseInt(e.substring(t+1),10);return e[0]==="["?[e.substring(1,t-1),r]:[e.substring(0,t),r]},ja=()=>{var n;return(n=as())===null||n===void 0?void 0:n.config},za=n=>{var e;return(e=as())===null||e===void 0?void 0:e[`_${n}`]};var ss=class{constructor(){this.reject=()=>{},this.resolve=()=>{},this.promise=new Promise((e,t)=>{this.resolve=e,this.reject=t})}wrapCallback(e){return(t,r)=>{t?this.reject(t):this.resolve(r),typeof e=="function"&&(this.promise.catch(()=>{}),e.length===1?e(t):e(t,r))}}};function us(n,e){if(n.uid)throw new Error('The "uid" field is no longer supported by mockUserToken. Please use "sub" instead for Firebase Auth User ID.');let t={alg:"none",type:"JWT"},r=e||"demo-project",i=n.iat||0,s=n.sub||n.user_id;if(!s)throw new Error("mockUserToken must contain 'sub' or 'user_id' field!");let a=Object.assign({iss:`https://securetoken.google.com/${r}`,aud:r,iat:i,exp:i+3600,auth_time:i,sub:s,user_id:s,firebase:{sign_in_provider:"custom",identities:{}}},n);return[Ur(JSON.stringify(t)),Ur(JSON.stringify(a)),""].join(".")}function se(){return typeof navigator<"u"&&typeof navigator.userAgent=="string"?navigator.userAgent:""}function Pd(){return typeof window<"u"&&!!(window.cordova||window.phonegap||window.PhoneGap)&&/ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test(se())}function ry(){var n;let e=(n=as())===null||n===void 0?void 0:n.forceEnvironment;if(e==="node")return!0;if(e==="browser")return!1;try{return Object.prototype.toString.call(global.process)==="[object process]"}catch{return!1}}function kd(){return typeof navigator<"u"&&navigator.userAgent==="Cloudflare-Workers"}function Br(){let n=typeof chrome=="object"?chrome.runtime:typeof browser=="object"?browser.runtime:void 0;return typeof n=="object"&&n.id!==void 0}function Cd(){return typeof navigator=="object"&&navigator.product==="ReactNative"}function Dd(){let n=se();return n.indexOf("MSIE ")>=0||n.indexOf("Trident/")>=0}function $a(){return!ry()&&!!navigator.userAgent&&navigator.userAgent.includes("Safari")&&!navigator.userAgent.includes("Chrome")}function Ge(){try{return typeof indexedDB=="object"}catch{return!1}}function _t(){return new Promise((n,e)=>{try{let t=!0,r="validate-browser-context-for-indexeddb-analytics-module",i=self.indexedDB.open(r);i.onsuccess=()=>{i.result.close(),t||self.indexedDB.deleteDatabase(r),n(!0)},i.onupgradeneeded=()=>{t=!1},i.onerror=()=>{var s;e(((s=i.error)===null||s===void 0?void 0:s.message)||"")}}catch(t){e(t)}})}function qr(){return!(typeof navigator>"u"||!navigator.cookieEnabled)}var iy="FirebaseError",he=class n extends Error{constructor(e,t,r){super(t),this.code=e,this.customData=r,this.name=iy,Object.setPrototypeOf(this,n.prototype),Error.captureStackTrace&&Error.captureStackTrace(this,ye.prototype.create)}},ye=class{constructor(e,t,r){this.service=e,this.serviceName=t,this.errors=r}create(e,...t){let r=t[0]||{},i=`${this.service}/${e}`,s=this.errors[e],a=s?sy(s,r):"Error",c=`${this.serviceName}: ${a} (${i}).`;return new he(i,c,r)}};function sy(n,e){return n.replace(oy,(t,r)=>{let i=e[r];return i!=null?String(i):`<${r}?>`})}var oy=/\{\$([^}]+)}/g;function Nd(n){for(let e in n)if(Object.prototype.hasOwnProperty.call(n,e))return!1;return!0}function Xe(n,e){if(n===e)return!0;let t=Object.keys(n),r=Object.keys(e);for(let i of t){if(!r.includes(i))return!1;let s=n[i],a=e[i];if(Ad(s)&&Ad(a)){if(!Xe(s,a))return!1}else if(s!==a)return!1}for(let i of r)if(!t.includes(i))return!1;return!0}function Ad(n){return n!==null&&typeof n=="object"}function Vn(n){let e=[];for(let[t,r]of Object.entries(n))Array.isArray(r)?r.forEach(i=>{e.push(encodeURIComponent(t)+"="+encodeURIComponent(i))}):e.push(encodeURIComponent(t)+"="+encodeURIComponent(r));return e.length?"&"+e.join("&"):""}function Ln(n){let e={};return n.replace(/^\?/,"").split("&").forEach(r=>{if(r){let[i,s]=r.split("=");e[decodeURIComponent(i)]=decodeURIComponent(s)}}),e}function Mn(n){let e=n.indexOf("?");if(!e)return"";let t=n.indexOf("#",e);return n.substring(e,t>0?t:void 0)}function Od(n,e){let t=new Ba(n,e);return t.subscribe.bind(t)}var Ba=class{constructor(e,t){this.observers=[],this.unsubscribes=[],this.observerCount=0,this.task=Promise.resolve(),this.finalized=!1,this.onNoObservers=t,this.task.then(()=>{e(this)}).catch(r=>{this.error(r)})}next(e){this.forEachObserver(t=>{t.next(e)})}error(e){this.forEachObserver(t=>{t.error(e)}),this.close(e)}complete(){this.forEachObserver(e=>{e.complete()}),this.close()}subscribe(e,t,r){let i;if(e===void 0&&t===void 0&&r===void 0)throw new Error("Missing Observer.");ay(e,["next","error","complete"])?i=e:i={next:e,error:t,complete:r},i.next===void 0&&(i.next=Fa),i.error===void 0&&(i.error=Fa),i.complete===void 0&&(i.complete=Fa);let s=this.unsubscribeOne.bind(this,this.observers.length);return this.finalized&&this.task.then(()=>{try{this.finalError?i.error(this.finalError):i.complete()}catch{}}),this.observers.push(i),s}unsubscribeOne(e){this.observers===void 0||this.observers[e]===void 0||(delete this.observers[e],this.observerCount-=1,this.observerCount===0&&this.onNoObservers!==void 0&&this.onNoObservers(this))}forEachObserver(e){if(!this.finalized)for(let t=0;t<this.observers.length;t++)this.sendOne(t,e)}sendOne(e,t){this.task.then(()=>{if(this.observers!==void 0&&this.observers[e]!==void 0)try{t(this.observers[e])}catch(r){typeof console<"u"&&console.error&&console.error(r)}})}close(e){this.finalized||(this.finalized=!0,e!==void 0&&(this.finalError=e),this.task.then(()=>{this.observers=void 0,this.onNoObservers=void 0}))}};function ay(n,e){if(typeof n!="object"||n===null)return!1;for(let t of e)if(t in n&&typeof n[t]=="function")return!0;return!1}function Fa(){}var cy=1e3,uy=2,ly=4*60*60*1e3,hy=.5;function Ka(n,e=cy,t=uy){let r=e*Math.pow(t,n),i=Math.round(hy*r*(Math.random()-.5)*2);return Math.min(ly,r+i)}function de(n){return n&&n._delegate?n._delegate:n}var te=class{constructor(e,t,r){this.name=e,this.instanceFactory=t,this.type=r,this.multipleInstances=!1,this.serviceProps={},this.instantiationMode="LAZY",this.onInstanceCreated=null}setInstantiationMode(e){return this.instantiationMode=e,this}setMultipleInstances(e){return this.multipleInstances=e,this}setServiceProps(e){return this.serviceProps=e,this}setInstanceCreatedCallback(e){return this.onInstanceCreated=e,this}};var Zt="[DEFAULT]";var Ga=class{constructor(e,t){this.name=e,this.container=t,this.component=null,this.instances=new Map,this.instancesDeferred=new Map,this.instancesOptions=new Map,this.onInitCallbacks=new Map}get(e){let t=this.normalizeInstanceIdentifier(e);if(!this.instancesDeferred.has(t)){let r=new ss;if(this.instancesDeferred.set(t,r),this.isInitialized(t)||this.shouldAutoInitialize())try{let i=this.getOrInitializeService({instanceIdentifier:t});i&&r.resolve(i)}catch{}}return this.instancesDeferred.get(t).promise}getImmediate(e){var t;let r=this.normalizeInstanceIdentifier(e?.identifier),i=(t=e?.optional)!==null&&t!==void 0?t:!1;if(this.isInitialized(r)||this.shouldAutoInitialize())try{return this.getOrInitializeService({instanceIdentifier:r})}catch(s){if(i)return null;throw s}else{if(i)return null;throw Error(`Service ${this.name} is not available`)}}getComponent(){return this.component}setComponent(e){if(e.name!==this.name)throw Error(`Mismatching Component ${e.name} for Provider ${this.name}.`);if(this.component)throw Error(`Component for ${this.name} has already been provided`);if(this.component=e,!!this.shouldAutoInitialize()){if(fy(e))try{this.getOrInitializeService({instanceIdentifier:Zt})}catch{}for(let[t,r]of this.instancesDeferred.entries()){let i=this.normalizeInstanceIdentifier(t);try{let s=this.getOrInitializeService({instanceIdentifier:i});r.resolve(s)}catch{}}}}clearInstance(e=Zt){this.instancesDeferred.delete(e),this.instancesOptions.delete(e),this.instances.delete(e)}async delete(){let e=Array.from(this.instances.values());await Promise.all([...e.filter(t=>"INTERNAL"in t).map(t=>t.INTERNAL.delete()),...e.filter(t=>"_delete"in t).map(t=>t._delete())])}isComponentSet(){return this.component!=null}isInitialized(e=Zt){return this.instances.has(e)}getOptions(e=Zt){return this.instancesOptions.get(e)||{}}initialize(e={}){let{options:t={}}=e,r=this.normalizeInstanceIdentifier(e.instanceIdentifier);if(this.isInitialized(r))throw Error(`${this.name}(${r}) has already been initialized`);if(!this.isComponentSet())throw Error(`Component ${this.name} has not been registered yet`);let i=this.getOrInitializeService({instanceIdentifier:r,options:t});for(let[s,a]of this.instancesDeferred.entries()){let c=this.normalizeInstanceIdentifier(s);r===c&&a.resolve(i)}return i}onInit(e,t){var r;let i=this.normalizeInstanceIdentifier(t),s=(r=this.onInitCallbacks.get(i))!==null&&r!==void 0?r:new Set;s.add(e),this.onInitCallbacks.set(i,s);let a=this.instances.get(i);return a&&e(a,i),()=>{s.delete(e)}}invokeOnInitCallbacks(e,t){let r=this.onInitCallbacks.get(t);if(r)for(let i of r)try{i(e,t)}catch{}}getOrInitializeService({instanceIdentifier:e,options:t={}}){let r=this.instances.get(e);if(!r&&this.component&&(r=this.component.instanceFactory(this.container,{instanceIdentifier:dy(e),options:t}),this.instances.set(e,r),this.instancesOptions.set(e,t),this.invokeOnInitCallbacks(r,e),this.component.onInstanceCreated))try{this.component.onInstanceCreated(this.container,e,r)}catch{}return r||null}normalizeInstanceIdentifier(e=Zt){return this.component?this.component.multipleInstances?e:Zt:e}shouldAutoInitialize(){return!!this.component&&this.component.instantiationMode!=="EXPLICIT"}};function dy(n){return n===Zt?void 0:n}function fy(n){return n.instantiationMode==="EAGER"}var ls=class{constructor(e){this.name=e,this.providers=new Map}addComponent(e){let t=this.getProvider(e.name);if(t.isComponentSet())throw new Error(`Component ${e.name} has already been registered with ${this.name}`);t.setComponent(e)}addOrOverwriteComponent(e){this.getProvider(e.name).isComponentSet()&&this.providers.delete(e.name),this.addComponent(e)}getProvider(e){if(this.providers.has(e))return this.providers.get(e);let t=new Ga(e,this);return this.providers.set(e,t),t}getProviders(){return Array.from(this.providers.values())}};var py=[],j;(function(n){n[n.DEBUG=0]="DEBUG",n[n.VERBOSE=1]="VERBOSE",n[n.INFO=2]="INFO",n[n.WARN=3]="WARN",n[n.ERROR=4]="ERROR",n[n.SILENT=5]="SILENT"})(j||(j={}));var my={debug:j.DEBUG,verbose:j.VERBOSE,info:j.INFO,warn:j.WARN,error:j.ERROR,silent:j.SILENT},gy=j.INFO,_y={[j.DEBUG]:"log",[j.VERBOSE]:"log",[j.INFO]:"info",[j.WARN]:"warn",[j.ERROR]:"error"},yy=(n,e,...t)=>{if(e<n.logLevel)return;let r=new Date().toISOString(),i=_y[e];if(i)console[i](`[${r}]  ${n.name}:`,...t);else throw new Error(`Attempted to log a message with an invalid logType (value: ${e})`)},Ze=class{constructor(e){this.name=e,this._logLevel=gy,this._logHandler=yy,this._userLogHandler=null,py.push(this)}get logLevel(){return this._logLevel}set logLevel(e){if(!(e in j))throw new TypeError(`Invalid value "${e}" assigned to \`logLevel\``);this._logLevel=e}setLogLevel(e){this._logLevel=typeof e=="string"?my[e]:e}get logHandler(){return this._logHandler}set logHandler(e){if(typeof e!="function")throw new TypeError("Value assigned to `logHandler` must be a function");this._logHandler=e}get userLogHandler(){return this._userLogHandler}set userLogHandler(e){this._userLogHandler=e}debug(...e){this._userLogHandler&&this._userLogHandler(this,j.DEBUG,...e),this._logHandler(this,j.DEBUG,...e)}log(...e){this._userLogHandler&&this._userLogHandler(this,j.VERBOSE,...e),this._logHandler(this,j.VERBOSE,...e)}info(...e){this._userLogHandler&&this._userLogHandler(this,j.INFO,...e),this._logHandler(this,j.INFO,...e)}warn(...e){this._userLogHandler&&this._userLogHandler(this,j.WARN,...e),this._logHandler(this,j.WARN,...e)}error(...e){this._userLogHandler&&this._userLogHandler(this,j.ERROR,...e),this._logHandler(this,j.ERROR,...e)}};var wy=(n,e)=>e.some(t=>n instanceof t),xd,Vd;function vy(){return xd||(xd=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function Iy(){return Vd||(Vd=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}var Ld=new WeakMap,Wa=new WeakMap,Md=new WeakMap,Ha=new WeakMap,Ya=new WeakMap;function Ty(n){let e=new Promise((t,r)=>{let i=()=>{n.removeEventListener("success",s),n.removeEventListener("error",a)},s=()=>{t(He(n.result)),i()},a=()=>{r(n.error),i()};n.addEventListener("success",s),n.addEventListener("error",a)});return e.then(t=>{t instanceof IDBCursor&&Ld.set(t,n)}).catch(()=>{}),Ya.set(e,n),e}function Ey(n){if(Wa.has(n))return;let e=new Promise((t,r)=>{let i=()=>{n.removeEventListener("complete",s),n.removeEventListener("error",a),n.removeEventListener("abort",a)},s=()=>{t(),i()},a=()=>{r(n.error||new DOMException("AbortError","AbortError")),i()};n.addEventListener("complete",s),n.addEventListener("error",a),n.addEventListener("abort",a)});Wa.set(n,e)}var Qa={get(n,e,t){if(n instanceof IDBTransaction){if(e==="done")return Wa.get(n);if(e==="objectStoreNames")return n.objectStoreNames||Md.get(n);if(e==="store")return t.objectStoreNames[1]?void 0:t.objectStore(t.objectStoreNames[0])}return He(n[e])},set(n,e,t){return n[e]=t,!0},has(n,e){return n instanceof IDBTransaction&&(e==="done"||e==="store")?!0:e in n}};function Fd(n){Qa=n(Qa)}function by(n){return n===IDBDatabase.prototype.transaction&&!("objectStoreNames"in IDBTransaction.prototype)?function(e,...t){let r=n.call(hs(this),e,...t);return Md.set(r,e.sort?e.sort():[e]),He(r)}:Iy().includes(n)?function(...e){return n.apply(hs(this),e),He(Ld.get(this))}:function(...e){return He(n.apply(hs(this),e))}}function Ay(n){return typeof n=="function"?by(n):(n instanceof IDBTransaction&&Ey(n),wy(n,vy())?new Proxy(n,Qa):n)}function He(n){if(n instanceof IDBRequest)return Ty(n);if(Ha.has(n))return Ha.get(n);let e=Ay(n);return e!==n&&(Ha.set(n,e),Ya.set(e,n)),e}var hs=n=>Ya.get(n);function et(n,e,{blocked:t,upgrade:r,blocking:i,terminated:s}={}){let a=indexedDB.open(n,e),c=He(a);return r&&a.addEventListener("upgradeneeded",u=>{r(He(a.result),u.oldVersion,u.newVersion,He(a.transaction),u)}),t&&a.addEventListener("blocked",u=>t(u.oldVersion,u.newVersion,u)),c.then(u=>{s&&u.addEventListener("close",()=>s()),i&&u.addEventListener("versionchange",d=>i(d.oldVersion,d.newVersion,d))}).catch(()=>{}),c}function Nt(n,{blocked:e}={}){let t=indexedDB.deleteDatabase(n);return e&&t.addEventListener("blocked",r=>e(r.oldVersion,r)),He(t).then(()=>{})}var Sy=["get","getKey","getAll","getAllKeys","count"],Ry=["put","add","delete","clear"],Ja=new Map;function Ud(n,e){if(!(n instanceof IDBDatabase&&!(e in n)&&typeof e=="string"))return;if(Ja.get(e))return Ja.get(e);let t=e.replace(/FromIndex$/,""),r=e!==t,i=Ry.includes(t);if(!(t in(r?IDBIndex:IDBObjectStore).prototype)||!(i||Sy.includes(t)))return;let s=async function(a,...c){let u=this.transaction(a,i?"readwrite":"readonly"),d=u.store;return r&&(d=d.index(c.shift())),(await Promise.all([d[t](...c),i&&u.done]))[0]};return Ja.set(e,s),s}Fd(n=>({...n,get:(e,t,r)=>Ud(e,t)||n.get(e,t,r),has:(e,t)=>!!Ud(e,t)||n.has(e,t)}));var Za=class{constructor(e){this.container=e}getPlatformInfoString(){return this.container.getProviders().map(t=>{if(Py(t)){let r=t.getImmediate();return`${r.library}/${r.version}`}else return null}).filter(t=>t).join(" ")}};function Py(n){let e=n.getComponent();return e?.type==="VERSION"}var ec="@firebase/app",Bd="0.11.1";var yt=new Ze("@firebase/app"),ky="@firebase/app-compat",Cy="@firebase/analytics-compat",Dy="@firebase/analytics",Ny="@firebase/app-check-compat",Oy="@firebase/app-check",xy="@firebase/auth",Vy="@firebase/auth-compat",Ly="@firebase/database",My="@firebase/data-connect",Fy="@firebase/database-compat",Uy="@firebase/functions",By="@firebase/functions-compat",qy="@firebase/installations",jy="@firebase/installations-compat",zy="@firebase/messaging",$y="@firebase/messaging-compat",Ky="@firebase/performance",Gy="@firebase/performance-compat",Hy="@firebase/remote-config",Wy="@firebase/remote-config-compat",Qy="@firebase/storage",Yy="@firebase/storage-compat",Jy="@firebase/firestore",Xy="@firebase/vertexai",Zy="@firebase/firestore-compat",ew="firebase",tw="11.3.1";var tc="[DEFAULT]",nw={[ec]:"fire-core",[ky]:"fire-core-compat",[Dy]:"fire-analytics",[Cy]:"fire-analytics-compat",[Oy]:"fire-app-check",[Ny]:"fire-app-check-compat",[xy]:"fire-auth",[Vy]:"fire-auth-compat",[Ly]:"fire-rtdb",[My]:"fire-data-connect",[Fy]:"fire-rtdb-compat",[Uy]:"fire-fn",[By]:"fire-fn-compat",[qy]:"fire-iid",[jy]:"fire-iid-compat",[zy]:"fire-fcm",[$y]:"fire-fcm-compat",[Ky]:"fire-perf",[Gy]:"fire-perf-compat",[Hy]:"fire-rc",[Wy]:"fire-rc-compat",[Qy]:"fire-gcs",[Yy]:"fire-gcs-compat",[Jy]:"fire-fst",[Zy]:"fire-fst-compat",[Xy]:"fire-vertex","fire-js":"fire-js",[ew]:"fire-js-all"};var jr=new Map,rw=new Map,nc=new Map;function qd(n,e){try{n.container.addComponent(e)}catch(t){yt.debug(`Component ${e.name} failed to register with FirebaseApp ${n.name}`,t)}}function oe(n){let e=n.name;if(nc.has(e))return yt.debug(`There were multiple attempts to register component ${e}.`),!1;nc.set(e,n);for(let t of jr.values())qd(t,n);for(let t of rw.values())qd(t,n);return!0}function pe(n,e){let t=n.container.getProvider("heartbeat").getImmediate({optional:!0});return t&&t.triggerHeartbeat(),n.container.getProvider(e)}function Ne(n){return n==null?!1:n.settings!==void 0}var iw={"no-app":"No Firebase App '{$appName}' has been created - call initializeApp() first","bad-app-name":"Illegal App name: '{$appName}'","duplicate-app":"Firebase App named '{$appName}' already exists with different options or config","app-deleted":"Firebase App named '{$appName}' already deleted","server-app-deleted":"Firebase Server App has been deleted","no-options":"Need to provide options, when not being deployed to hosting via source.","invalid-app-argument":"firebase.{$appName}() takes either no argument or a Firebase App instance.","invalid-log-argument":"First argument to `onLog` must be null or a function.","idb-open":"Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.","idb-get":"Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.","idb-set":"Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.","idb-delete":"Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.","finalization-registry-not-supported":"FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.","invalid-server-app-environment":"FirebaseServerApp is not for use in browser environments."},Ot=new ye("app","Firebase",iw);var rc=class{constructor(e,t,r){this._isDeleted=!1,this._options=Object.assign({},e),this._config=Object.assign({},t),this._name=t.name,this._automaticDataCollectionEnabled=t.automaticDataCollectionEnabled,this._container=r,this.container.addComponent(new te("app",()=>this,"PUBLIC"))}get automaticDataCollectionEnabled(){return this.checkDestroyed(),this._automaticDataCollectionEnabled}set automaticDataCollectionEnabled(e){this.checkDestroyed(),this._automaticDataCollectionEnabled=e}get name(){return this.checkDestroyed(),this._name}get options(){return this.checkDestroyed(),this._options}get config(){return this.checkDestroyed(),this._config}get container(){return this._container}get isDeleted(){return this._isDeleted}set isDeleted(e){this._isDeleted=e}checkDestroyed(){if(this.isDeleted)throw Ot.create("app-deleted",{appName:this._name})}};var tt=tw;function $r(n,e={}){let t=n;typeof e!="object"&&(e={name:e});let r=Object.assign({name:tc,automaticDataCollectionEnabled:!1},e),i=r.name;if(typeof i!="string"||!i)throw Ot.create("bad-app-name",{appName:String(i)});if(t||(t=ja()),!t)throw Ot.create("no-options");let s=jr.get(i);if(s){if(Xe(t,s.options)&&Xe(r,s.config))return s;throw Ot.create("duplicate-app",{appName:i})}let a=new ls(i);for(let u of nc.values())a.addComponent(u);let c=new rc(t,r,a);return jr.set(i,c),c}function Ve(n=tc){let e=jr.get(n);if(!e&&n===tc&&ja())return $r();if(!e)throw Ot.create("no-app",{appName:n});return e}function oc(){return Array.from(jr.values())}function re(n,e,t){var r;let i=(r=nw[n])!==null&&r!==void 0?r:n;t&&(i+=`-${t}`);let s=i.match(/\s|\//),a=e.match(/\s|\//);if(s||a){let c=[`Unable to register library "${i}" with version "${e}":`];s&&c.push(`library name "${i}" contains illegal characters (whitespace or "/")`),s&&a&&c.push("and"),a&&c.push(`version name "${e}" contains illegal characters (whitespace or "/")`),yt.warn(c.join(" "));return}oe(new te(`${i}-version`,()=>({library:i,version:e}),"VERSION"))}var sw="firebase-heartbeat-database",ow=1,zr="firebase-heartbeat-store",Xa=null;function Kd(){return Xa||(Xa=et(sw,ow,{upgrade:(n,e)=>{switch(e){case 0:try{n.createObjectStore(zr)}catch(t){console.warn(t)}}}}).catch(n=>{throw Ot.create("idb-open",{originalErrorMessage:n.message})})),Xa}async function aw(n){try{let t=(await Kd()).transaction(zr),r=await t.objectStore(zr).get(Gd(n));return await t.done,r}catch(e){if(e instanceof he)yt.warn(e.message);else{let t=Ot.create("idb-get",{originalErrorMessage:e?.message});yt.warn(t.message)}}}async function jd(n,e){try{let r=(await Kd()).transaction(zr,"readwrite");await r.objectStore(zr).put(e,Gd(n)),await r.done}catch(t){if(t instanceof he)yt.warn(t.message);else{let r=Ot.create("idb-set",{originalErrorMessage:t?.message});yt.warn(r.message)}}}function Gd(n){return`${n.name}!${n.options.appId}`}var cw=1024,uw=30,ic=class{constructor(e){this.container=e,this._heartbeatsCache=null;let t=this.container.getProvider("app").getImmediate();this._storage=new sc(t),this._heartbeatsCachePromise=this._storage.read().then(r=>(this._heartbeatsCache=r,r))}async triggerHeartbeat(){var e,t;try{let i=this.container.getProvider("platform-logger").getImmediate().getPlatformInfoString(),s=zd();if(((e=this._heartbeatsCache)===null||e===void 0?void 0:e.heartbeats)==null&&(this._heartbeatsCache=await this._heartbeatsCachePromise,((t=this._heartbeatsCache)===null||t===void 0?void 0:t.heartbeats)==null)||this._heartbeatsCache.lastSentHeartbeatDate===s||this._heartbeatsCache.heartbeats.some(a=>a.date===s))return;if(this._heartbeatsCache.heartbeats.push({date:s,agent:i}),this._heartbeatsCache.heartbeats.length>uw){let a=hw(this._heartbeatsCache.heartbeats);this._heartbeatsCache.heartbeats.splice(a,1)}return this._storage.overwrite(this._heartbeatsCache)}catch(r){yt.warn(r)}}async getHeartbeatsHeader(){var e;try{if(this._heartbeatsCache===null&&await this._heartbeatsCachePromise,((e=this._heartbeatsCache)===null||e===void 0?void 0:e.heartbeats)==null||this._heartbeatsCache.heartbeats.length===0)return"";let t=zd(),{heartbeatsToSend:r,unsentEntries:i}=lw(this._heartbeatsCache.heartbeats),s=Ur(JSON.stringify({version:2,heartbeats:r}));return this._heartbeatsCache.lastSentHeartbeatDate=t,i.length>0?(this._heartbeatsCache.heartbeats=i,await this._storage.overwrite(this._heartbeatsCache)):(this._heartbeatsCache.heartbeats=[],this._storage.overwrite(this._heartbeatsCache)),s}catch(t){return yt.warn(t),""}}};function zd(){return new Date().toISOString().substring(0,10)}function lw(n,e=cw){let t=[],r=n.slice();for(let i of n){let s=t.find(a=>a.agent===i.agent);if(s){if(s.dates.push(i.date),$d(t)>e){s.dates.pop();break}}else if(t.push({agent:i.agent,dates:[i.date]}),$d(t)>e){t.pop();break}r=r.slice(1)}return{heartbeatsToSend:t,unsentEntries:r}}var sc=class{constructor(e){this.app=e,this._canUseIndexedDBPromise=this.runIndexedDBEnvironmentCheck()}async runIndexedDBEnvironmentCheck(){return Ge()?_t().then(()=>!0).catch(()=>!1):!1}async read(){if(await this._canUseIndexedDBPromise){let t=await aw(this.app);return t?.heartbeats?t:{heartbeats:[]}}else return{heartbeats:[]}}async overwrite(e){var t;if(await this._canUseIndexedDBPromise){let i=await this.read();return jd(this.app,{lastSentHeartbeatDate:(t=e.lastSentHeartbeatDate)!==null&&t!==void 0?t:i.lastSentHeartbeatDate,heartbeats:e.heartbeats})}else return}async add(e){var t;if(await this._canUseIndexedDBPromise){let i=await this.read();return jd(this.app,{lastSentHeartbeatDate:(t=e.lastSentHeartbeatDate)!==null&&t!==void 0?t:i.lastSentHeartbeatDate,heartbeats:[...i.heartbeats,...e.heartbeats]})}else return}};function $d(n){return Ur(JSON.stringify({version:2,heartbeats:n})).length}function hw(n){if(n.length===0)return-1;let e=0,t=n[0].date;for(let r=1;r<n.length;r++)n[r].date<t&&(t=n[r].date,e=r);return e}function dw(n){oe(new te("platform-logger",e=>new Za(e),"PRIVATE")),oe(new te("heartbeat",e=>new ic(e),"PRIVATE")),re(ec,Bd,n),re(ec,Bd,"esm2017"),re("fire-js","")}dw("");var fw="firebase",pw="11.3.1";re(fw,pw,"app");var Qd="@firebase/installations",lc="0.6.12";var Yd=1e4,Jd=`w:${lc}`,Xd="FIS_v2",mw="https://firebaseinstallations.googleapis.com/v1",gw=60*60*1e3,_w="installations",yw="Installations";var ww={"missing-app-config-values":'Missing App configuration value: "{$valueName}"',"not-registered":"Firebase Installation is not registered.","installation-not-found":"Firebase Installation not found.","request-failed":'{$requestName} request failed with error "{$serverCode} {$serverStatus}: {$serverMessage}"',"app-offline":"Could not process request. Application offline.","delete-pending-registration":"Can't delete installation while there is a pending registration request."},tn=new ye(_w,yw,ww);function Zd(n){return n instanceof he&&n.code.includes("request-failed")}function ef({projectId:n}){return`${mw}/projects/${n}/installations`}function tf(n){return{token:n.token,requestStatus:2,expiresIn:Iw(n.expiresIn),creationTime:Date.now()}}async function nf(n,e){let r=(await e.json()).error;return tn.create("request-failed",{requestName:n,serverCode:r.code,serverMessage:r.message,serverStatus:r.status})}function rf({apiKey:n}){return new Headers({"Content-Type":"application/json",Accept:"application/json","x-goog-api-key":n})}function vw(n,{refreshToken:e}){let t=rf(n);return t.append("Authorization",Tw(e)),t}async function sf(n){let e=await n();return e.status>=500&&e.status<600?n():e}function Iw(n){return Number(n.replace("s","000"))}function Tw(n){return`${Xd} ${n}`}async function Ew({appConfig:n,heartbeatServiceProvider:e},{fid:t}){let r=ef(n),i=rf(n),s=e.getImmediate({optional:!0});if(s){let d=await s.getHeartbeatsHeader();d&&i.append("x-firebase-client",d)}let a={fid:t,authVersion:Xd,appId:n.appId,sdkVersion:Jd},c={method:"POST",headers:i,body:JSON.stringify(a)},u=await sf(()=>fetch(r,c));if(u.ok){let d=await u.json();return{fid:d.fid||t,registrationStatus:2,refreshToken:d.refreshToken,authToken:tf(d.authToken)}}else throw await nf("Create Installation",u)}function of(n){return new Promise(e=>{setTimeout(e,n)})}function bw(n){return btoa(String.fromCharCode(...n)).replace(/\+/g,"-").replace(/\//g,"_")}var Aw=/^[cdef][\w-]{21}$/,uc="";function Sw(){try{let n=new Uint8Array(17);(self.crypto||self.msCrypto).getRandomValues(n),n[0]=112+n[0]%16;let t=Rw(n);return Aw.test(t)?t:uc}catch{return uc}}function Rw(n){return bw(n).substr(0,22)}function fs(n){return`${n.appName}!${n.appId}`}var af=new Map;function cf(n,e){let t=fs(n);uf(t,e),Pw(t,e)}function uf(n,e){let t=af.get(n);if(t)for(let r of t)r(e)}function Pw(n,e){let t=kw();t&&t.postMessage({key:n,fid:e}),Cw()}var en=null;function kw(){return!en&&"BroadcastChannel"in self&&(en=new BroadcastChannel("[Firebase] FID Change"),en.onmessage=n=>{uf(n.data.key,n.data.fid)}),en}function Cw(){af.size===0&&en&&(en.close(),en=null)}var Dw="firebase-installations-database",Nw=1,nn="firebase-installations-store",ac=null;function hc(){return ac||(ac=et(Dw,Nw,{upgrade:(n,e)=>{switch(e){case 0:n.createObjectStore(nn)}}})),ac}async function ds(n,e){let t=fs(n),i=(await hc()).transaction(nn,"readwrite"),s=i.objectStore(nn),a=await s.get(t);return await s.put(e,t),await i.done,(!a||a.fid!==e.fid)&&cf(n,e.fid),e}async function lf(n){let e=fs(n),r=(await hc()).transaction(nn,"readwrite");await r.objectStore(nn).delete(e),await r.done}async function ps(n,e){let t=fs(n),i=(await hc()).transaction(nn,"readwrite"),s=i.objectStore(nn),a=await s.get(t),c=e(a);return c===void 0?await s.delete(t):await s.put(c,t),await i.done,c&&(!a||a.fid!==c.fid)&&cf(n,c.fid),c}async function dc(n){let e,t=await ps(n.appConfig,r=>{let i=Ow(r),s=xw(n,i);return e=s.registrationPromise,s.installationEntry});return t.fid===uc?{installationEntry:await e}:{installationEntry:t,registrationPromise:e}}function Ow(n){let e=n||{fid:Sw(),registrationStatus:0};return hf(e)}function xw(n,e){if(e.registrationStatus===0){if(!navigator.onLine){let i=Promise.reject(tn.create("app-offline"));return{installationEntry:e,registrationPromise:i}}let t={fid:e.fid,registrationStatus:1,registrationTime:Date.now()},r=Vw(n,t);return{installationEntry:t,registrationPromise:r}}else return e.registrationStatus===1?{installationEntry:e,registrationPromise:Lw(n)}:{installationEntry:e}}async function Vw(n,e){try{let t=await Ew(n,e);return ds(n.appConfig,t)}catch(t){throw Zd(t)&&t.customData.serverCode===409?await lf(n.appConfig):await ds(n.appConfig,{fid:e.fid,registrationStatus:0}),t}}async function Lw(n){let e=await Hd(n.appConfig);for(;e.registrationStatus===1;)await of(100),e=await Hd(n.appConfig);if(e.registrationStatus===0){let{installationEntry:t,registrationPromise:r}=await dc(n);return r||t}return e}function Hd(n){return ps(n,e=>{if(!e)throw tn.create("installation-not-found");return hf(e)})}function hf(n){return Mw(n)?{fid:n.fid,registrationStatus:0}:n}function Mw(n){return n.registrationStatus===1&&n.registrationTime+Yd<Date.now()}async function Fw({appConfig:n,heartbeatServiceProvider:e},t){let r=Uw(n,t),i=vw(n,t),s=e.getImmediate({optional:!0});if(s){let d=await s.getHeartbeatsHeader();d&&i.append("x-firebase-client",d)}let a={installation:{sdkVersion:Jd,appId:n.appId}},c={method:"POST",headers:i,body:JSON.stringify(a)},u=await sf(()=>fetch(r,c));if(u.ok){let d=await u.json();return tf(d)}else throw await nf("Generate Auth Token",u)}function Uw(n,{fid:e}){return`${ef(n)}/${e}/authTokens:generate`}async function fc(n,e=!1){let t,r=await ps(n.appConfig,s=>{if(!df(s))throw tn.create("not-registered");let a=s.authToken;if(!e&&jw(a))return s;if(a.requestStatus===1)return t=Bw(n,e),s;{if(!navigator.onLine)throw tn.create("app-offline");let c=$w(s);return t=qw(n,c),c}});return t?await t:r.authToken}async function Bw(n,e){let t=await Wd(n.appConfig);for(;t.authToken.requestStatus===1;)await of(100),t=await Wd(n.appConfig);let r=t.authToken;return r.requestStatus===0?fc(n,e):r}function Wd(n){return ps(n,e=>{if(!df(e))throw tn.create("not-registered");let t=e.authToken;return Kw(t)?Object.assign(Object.assign({},e),{authToken:{requestStatus:0}}):e})}async function qw(n,e){try{let t=await Fw(n,e),r=Object.assign(Object.assign({},e),{authToken:t});return await ds(n.appConfig,r),t}catch(t){if(Zd(t)&&(t.customData.serverCode===401||t.customData.serverCode===404))await lf(n.appConfig);else{let r=Object.assign(Object.assign({},e),{authToken:{requestStatus:0}});await ds(n.appConfig,r)}throw t}}function df(n){return n!==void 0&&n.registrationStatus===2}function jw(n){return n.requestStatus===2&&!zw(n)}function zw(n){let e=Date.now();return e<n.creationTime||n.creationTime+n.expiresIn<e+gw}function $w(n){let e={requestStatus:1,requestTime:Date.now()};return Object.assign(Object.assign({},n),{authToken:e})}function Kw(n){return n.requestStatus===1&&n.requestTime+Yd<Date.now()}async function Gw(n){let e=n,{installationEntry:t,registrationPromise:r}=await dc(e);return r?r.catch(console.error):fc(e).catch(console.error),t.fid}async function Hw(n,e=!1){let t=n;return await Ww(t),(await fc(t,e)).token}async function Ww(n){let{registrationPromise:e}=await dc(n);e&&await e}function Qw(n){if(!n||!n.options)throw cc("App Configuration");if(!n.name)throw cc("App Name");let e=["projectId","apiKey","appId"];for(let t of e)if(!n.options[t])throw cc(t);return{appName:n.name,projectId:n.options.projectId,apiKey:n.options.apiKey,appId:n.options.appId}}function cc(n){return tn.create("missing-app-config-values",{valueName:n})}var ff="installations",Yw="installations-internal",Jw=n=>{let e=n.getProvider("app").getImmediate(),t=Qw(e),r=pe(e,"heartbeat");return{app:e,appConfig:t,heartbeatServiceProvider:r,_delete:()=>Promise.resolve()}},Xw=n=>{let e=n.getProvider("app").getImmediate(),t=pe(e,ff).getImmediate();return{getId:()=>Gw(t),getToken:i=>Hw(t,i)}};function Zw(){oe(new te(ff,Jw,"PUBLIC")),oe(new te(Yw,Xw,"PRIVATE"))}Zw();re(Qd,lc);re(Qd,lc,"esm2017");var _f="BDOU99-h67HcA6JeFXHbSNMu7e2yNNu3RzoMj8TM4W88jITfq7ZmPvIM1Iv-4_l2LxQcYwhqby2xGpWwzjfAnG4",ev="https://fcmregistrations.googleapis.com/v1",yf="FCM_MSG",tv="google.c.a.c_id",nv=3,rv=1,ms;(function(n){n[n.DATA_MESSAGE=1]="DATA_MESSAGE",n[n.DISPLAY_NOTIFICATION=3]="DISPLAY_NOTIFICATION"})(ms||(ms={}));var gs;(function(n){n.PUSH_RECEIVED="push-received",n.NOTIFICATION_CLICKED="notification-clicked"})(gs||(gs={}));function wt(n){let e=new Uint8Array(n);return btoa(String.fromCharCode(...e)).replace(/=/g,"").replace(/\+/g,"-").replace(/\//g,"_")}function iv(n){let e="=".repeat((4-n.length%4)%4),t=(n+e).replace(/\-/g,"+").replace(/_/g,"/"),r=atob(t),i=new Uint8Array(r.length);for(let s=0;s<r.length;++s)i[s]=r.charCodeAt(s);return i}var pc="fcm_token_details_db",sv=5,pf="fcm_token_object_Store";async function ov(n){if("databases"in indexedDB&&!(await indexedDB.databases()).map(s=>s.name).includes(pc))return null;let e=null;return(await et(pc,sv,{upgrade:async(r,i,s,a)=>{var c;if(i<2||!r.objectStoreNames.contains(pf))return;let u=a.objectStore(pf),d=await u.index("fcmSenderId").get(n);if(await u.clear(),!!d){if(i===2){let f=d;if(!f.auth||!f.p256dh||!f.endpoint)return;e={token:f.fcmToken,createTime:(c=f.createTime)!==null&&c!==void 0?c:Date.now(),subscriptionOptions:{auth:f.auth,p256dh:f.p256dh,endpoint:f.endpoint,swScope:f.swScope,vapidKey:typeof f.vapidKey=="string"?f.vapidKey:wt(f.vapidKey)}}}else if(i===3){let f=d;e={token:f.fcmToken,createTime:f.createTime,subscriptionOptions:{auth:wt(f.auth),p256dh:wt(f.p256dh),endpoint:f.endpoint,swScope:f.swScope,vapidKey:wt(f.vapidKey)}}}else if(i===4){let f=d;e={token:f.fcmToken,createTime:f.createTime,subscriptionOptions:{auth:wt(f.auth),p256dh:wt(f.p256dh),endpoint:f.endpoint,swScope:f.swScope,vapidKey:wt(f.vapidKey)}}}}}})).close(),await Nt(pc),await Nt("fcm_vapid_details_db"),await Nt("undefined"),av(e)?e:null}function av(n){if(!n||!n.subscriptionOptions)return!1;let{subscriptionOptions:e}=n;return typeof n.createTime=="number"&&n.createTime>0&&typeof n.token=="string"&&n.token.length>0&&typeof e.auth=="string"&&e.auth.length>0&&typeof e.p256dh=="string"&&e.p256dh.length>0&&typeof e.endpoint=="string"&&e.endpoint.length>0&&typeof e.swScope=="string"&&e.swScope.length>0&&typeof e.vapidKey=="string"&&e.vapidKey.length>0}var cv="firebase-messaging-database",uv=1,rn="firebase-messaging-store",mc=null;function yc(){return mc||(mc=et(cv,uv,{upgrade:(n,e)=>{switch(e){case 0:n.createObjectStore(rn)}}})),mc}async function wc(n){let e=Ic(n),r=await(await yc()).transaction(rn).objectStore(rn).get(e);if(r)return r;{let i=await ov(n.appConfig.senderId);if(i)return await vc(n,i),i}}async function vc(n,e){let t=Ic(n),i=(await yc()).transaction(rn,"readwrite");return await i.objectStore(rn).put(e,t),await i.done,e}async function lv(n){let e=Ic(n),r=(await yc()).transaction(rn,"readwrite");await r.objectStore(rn).delete(e),await r.done}function Ic({appConfig:n}){return n.appId}var hv={"missing-app-config-values":'Missing App configuration value: "{$valueName}"',"only-available-in-window":"This method is available in a Window context.","only-available-in-sw":"This method is available in a service worker context.","permission-default":"The notification permission was not granted and dismissed instead.","permission-blocked":"The notification permission was not granted and blocked instead.","unsupported-browser":"This browser doesn't support the API's required to use the Firebase SDK.","indexed-db-unsupported":"This browser doesn't support indexedDb.open() (ex. Safari iFrame, Firefox Private Browsing, etc)","failed-service-worker-registration":"We are unable to register the default service worker. {$browserErrorMessage}","token-subscribe-failed":"A problem occurred while subscribing the user to FCM: {$errorInfo}","token-subscribe-no-token":"FCM returned no token when subscribing the user to push.","token-unsubscribe-failed":"A problem occurred while unsubscribing the user from FCM: {$errorInfo}","token-update-failed":"A problem occurred while updating the user from FCM: {$errorInfo}","token-update-no-token":"FCM returned no token when updating the user to push.","use-sw-after-get-token":"The useServiceWorker() method may only be called once and must be called before calling getToken() to ensure your service worker is used.","invalid-sw-registration":"The input to useServiceWorker() must be a ServiceWorkerRegistration.","invalid-bg-handler":"The input to setBackgroundMessageHandler() must be a function.","invalid-vapid-key":"The public VAPID key must be a string.","use-vapid-key-after-get-token":"The usePublicVapidKey() method may only be called once and must be called before calling getToken() to ensure your VAPID key is used."},Be=new ye("messaging","Messaging",hv);async function dv(n,e){let t=await Ec(n),r=vf(e),i={method:"POST",headers:t,body:JSON.stringify(r)},s;try{s=await(await fetch(Tc(n.appConfig),i)).json()}catch(a){throw Be.create("token-subscribe-failed",{errorInfo:a?.toString()})}if(s.error){let a=s.error.message;throw Be.create("token-subscribe-failed",{errorInfo:a})}if(!s.token)throw Be.create("token-subscribe-no-token");return s.token}async function fv(n,e){let t=await Ec(n),r=vf(e.subscriptionOptions),i={method:"PATCH",headers:t,body:JSON.stringify(r)},s;try{s=await(await fetch(`${Tc(n.appConfig)}/${e.token}`,i)).json()}catch(a){throw Be.create("token-update-failed",{errorInfo:a?.toString()})}if(s.error){let a=s.error.message;throw Be.create("token-update-failed",{errorInfo:a})}if(!s.token)throw Be.create("token-update-no-token");return s.token}async function wf(n,e){let r={method:"DELETE",headers:await Ec(n)};try{let s=await(await fetch(`${Tc(n.appConfig)}/${e}`,r)).json();if(s.error){let a=s.error.message;throw Be.create("token-unsubscribe-failed",{errorInfo:a})}}catch(i){throw Be.create("token-unsubscribe-failed",{errorInfo:i?.toString()})}}function Tc({projectId:n}){return`${ev}/projects/${n}/registrations`}async function Ec({appConfig:n,installations:e}){let t=await e.getToken();return new Headers({"Content-Type":"application/json",Accept:"application/json","x-goog-api-key":n.apiKey,"x-goog-firebase-installations-auth":`FIS ${t}`})}function vf({p256dh:n,auth:e,endpoint:t,vapidKey:r}){let i={web:{endpoint:t,auth:e,p256dh:n}};return r!==_f&&(i.web.applicationPubKey=r),i}var pv=7*24*60*60*1e3;async function mv(n){let e=await _v(n.swRegistration,n.vapidKey),t={vapidKey:n.vapidKey,swScope:n.swRegistration.scope,endpoint:e.endpoint,auth:wt(e.getKey("auth")),p256dh:wt(e.getKey("p256dh"))},r=await wc(n.firebaseDependencies);if(r){if(yv(r.subscriptionOptions,t))return Date.now()>=r.createTime+pv?gv(n,{token:r.token,createTime:Date.now(),subscriptionOptions:t}):r.token;try{await wf(n.firebaseDependencies,r.token)}catch(i){console.warn(i)}return gf(n.firebaseDependencies,t)}else return gf(n.firebaseDependencies,t)}async function mf(n){let e=await wc(n.firebaseDependencies);e&&(await wf(n.firebaseDependencies,e.token),await lv(n.firebaseDependencies));let t=await n.swRegistration.pushManager.getSubscription();return t?t.unsubscribe():!0}async function gv(n,e){try{let t=await fv(n.firebaseDependencies,e),r=Object.assign(Object.assign({},e),{token:t,createTime:Date.now()});return await vc(n.firebaseDependencies,r),t}catch(t){throw t}}async function gf(n,e){let r={token:await dv(n,e),createTime:Date.now(),subscriptionOptions:e};return await vc(n,r),r.token}async function _v(n,e){let t=await n.pushManager.getSubscription();return t||n.pushManager.subscribe({userVisibleOnly:!0,applicationServerKey:iv(e)})}function yv(n,e){let t=e.vapidKey===n.vapidKey,r=e.endpoint===n.endpoint,i=e.auth===n.auth,s=e.p256dh===n.p256dh;return t&&r&&i&&s}function wv(n){let e={from:n.from,collapseKey:n.collapse_key,messageId:n.fcmMessageId};return vv(e,n),Iv(e,n),Tv(e,n),e}function vv(n,e){if(!e.notification)return;n.notification={};let t=e.notification.title;t&&(n.notification.title=t);let r=e.notification.body;r&&(n.notification.body=r);let i=e.notification.image;i&&(n.notification.image=i);let s=e.notification.icon;s&&(n.notification.icon=s)}function Iv(n,e){e.data&&(n.data=e.data)}function Tv(n,e){var t,r,i,s,a;if(!e.fcmOptions&&!(!((t=e.notification)===null||t===void 0)&&t.click_action))return;n.fcmOptions={};let c=(i=(r=e.fcmOptions)===null||r===void 0?void 0:r.link)!==null&&i!==void 0?i:(s=e.notification)===null||s===void 0?void 0:s.click_action;c&&(n.fcmOptions.link=c);let u=(a=e.fcmOptions)===null||a===void 0?void 0:a.analytics_label;u&&(n.fcmOptions.analyticsLabel=u)}function Ev(n){return typeof n=="object"&&!!n&&tv in n}function bv(n){return new Promise(e=>{setTimeout(e,n)})}kv("AzSCbw63g1R0nCw85jG8","Iaya3yLKwmgvh7cF0q4");async function Av(n,e){let t=Sv(e,await n.firebaseDependencies.installations.getId());Rv(n,t,e.productId)}function Sv(n,e){var t,r;let i={};return n.from&&(i.project_number=n.from),n.fcmMessageId&&(i.message_id=n.fcmMessageId),i.instance_id=e,n.notification?i.message_type=ms.DISPLAY_NOTIFICATION.toString():i.message_type=ms.DATA_MESSAGE.toString(),i.sdk_platform=nv.toString(),i.package_name=self.origin.replace(/(^\w+:|^)\/\//,""),n.collapse_key&&(i.collapse_key=n.collapse_key),i.event=rv.toString(),!((t=n.fcmOptions)===null||t===void 0)&&t.analytics_label&&(i.analytics_label=(r=n.fcmOptions)===null||r===void 0?void 0:r.analytics_label),i}function Rv(n,e,t){let r={};r.event_time_ms=Math.floor(Date.now()).toString(),r.source_extension_json_proto3=JSON.stringify({messaging_client_event:e}),t&&(r.compliance_data=Pv(t)),n.logEvents.push(r)}function Pv(n){return{privacy_context:{prequest:{origin_associated_product_id:n}}}}function kv(n,e){let t=[];for(let r=0;r<n.length;r++)t.push(n.charAt(r)),r<e.length&&t.push(e.charAt(r));return t.join("")}async function Cv(n,e){var t,r;let{newSubscription:i}=n;if(!i){await mf(e);return}let s=await wc(e.firebaseDependencies);await mf(e),e.vapidKey=(r=(t=s?.subscriptionOptions)===null||t===void 0?void 0:t.vapidKey)!==null&&r!==void 0?r:_f,await mv(e)}async function Dv(n,e){let t=xv(n);if(!t)return;e.deliveryMetricsExportedToBigQueryEnabled&&await Av(e,t);let r=await If();if(Lv(r))return Mv(r,t);if(t.notification&&await Fv(Ov(t)),!!e&&e.onBackgroundMessageHandler){let i=wv(t);typeof e.onBackgroundMessageHandler=="function"?await e.onBackgroundMessageHandler(i):e.onBackgroundMessageHandler.next(i)}}async function Nv(n){var e,t;let r=(t=(e=n.notification)===null||e===void 0?void 0:e.data)===null||t===void 0?void 0:t[yf];if(r){if(n.action)return}else return;n.stopImmediatePropagation(),n.notification.close();let i=Uv(r);if(!i)return;let s=new URL(i,self.location.href),a=new URL(self.location.origin);if(s.host!==a.host)return;let c=await Vv(s);if(c?c=await c.focus():(c=await self.clients.openWindow(i),await bv(3e3)),!!c)return r.messageType=gs.NOTIFICATION_CLICKED,r.isFirebaseMessaging=!0,c.postMessage(r)}function Ov(n){let e=Object.assign({},n.notification);return e.data={[yf]:n},e}function xv({data:n}){if(!n)return null;try{return n.json()}catch{return null}}async function Vv(n){let e=await If();for(let t of e){let r=new URL(t.url,self.location.href);if(n.host===r.host)return t}return null}function Lv(n){return n.some(e=>e.visibilityState==="visible"&&!e.url.startsWith("chrome-extension://"))}function Mv(n,e){e.isFirebaseMessaging=!0,e.messageType=gs.PUSH_RECEIVED;for(let t of n)t.postMessage(e)}function If(){return self.clients.matchAll({type:"window",includeUncontrolled:!0})}function Fv(n){var e;let{actions:t}=n,{maxActions:r}=Notification;return t&&r&&t.length>r&&console.warn(`This browser only supports ${r} actions. The remaining actions will not be displayed.`),self.registration.showNotification((e=n.title)!==null&&e!==void 0?e:"",n)}function Uv(n){var e,t,r;let i=(t=(e=n.fcmOptions)===null||e===void 0?void 0:e.link)!==null&&t!==void 0?t:(r=n.notification)===null||r===void 0?void 0:r.click_action;return i||(Ev(n.data)?self.location.origin:null)}function Bv(n){if(!n||!n.options)throw gc("App Configuration Object");if(!n.name)throw gc("App Name");let e=["projectId","apiKey","appId","messagingSenderId"],{options:t}=n;for(let r of e)if(!t[r])throw gc(r);return{appName:n.name,projectId:t.projectId,apiKey:t.apiKey,appId:t.appId,senderId:t.messagingSenderId}}function gc(n){return Be.create("missing-app-config-values",{valueName:n})}var _c=class{constructor(e,t,r){this.deliveryMetricsExportedToBigQueryEnabled=!1,this.onBackgroundMessageHandler=null,this.onMessageHandler=null,this.logEvents=[],this.isLogServiceStarted=!1;let i=Bv(e);this.firebaseDependencies={app:e,appConfig:i,installations:t,analyticsProvider:r}}_delete(){return Promise.resolve()}};var qv=n=>{let e=new _c(n.getProvider("app").getImmediate(),n.getProvider("installations-internal").getImmediate(),n.getProvider("analytics-internal"));return self.addEventListener("push",t=>{t.waitUntil(Dv(t,e))}),self.addEventListener("pushsubscriptionchange",t=>{t.waitUntil(Cv(t,e))}),self.addEventListener("notificationclick",t=>{t.waitUntil(Nv(t))}),e};function jv(){oe(new te("messaging-sw",qv,"PUBLIC"))}async function zv(){return Ge()&&await _t()&&"PushManager"in self&&"Notification"in self&&ServiceWorkerRegistration.prototype.hasOwnProperty("showNotification")&&PushSubscription.prototype.hasOwnProperty("getKey")}function $v(n,e){if(self.document!==void 0)throw Be.create("only-available-in-sw");return n.onBackgroundMessageHandler=e,()=>{n.onBackgroundMessageHandler=null}}function Tf(n=Ve()){return zv().then(e=>{if(!e)throw Be.create("unsupported-browser")},e=>{throw Be.create("indexed-db-unsupported")}),pe(de(n),"messaging-sw").getImmediate()}function Ef(n,e){return n=de(n),$v(n,e)}jv();function _s(n,e){var t={};for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&e.indexOf(r)<0&&(t[r]=n[r]);if(n!=null&&typeof Object.getOwnPropertySymbols=="function")for(var i=0,r=Object.getOwnPropertySymbols(n);i<r.length;i++)e.indexOf(r[i])<0&&Object.prototype.propertyIsEnumerable.call(n,r[i])&&(t[r[i]]=n[r[i]]);return t}function jf(){return{"dependent-sdk-initialized-before-auth":"Another Firebase SDK was initialized and is trying to use Auth before Auth is initialized. Please be sure to call `initializeAuth` or `getAuth` before starting any other Firebase SDK."}}var zf=jf,$f=new ye("auth","Firebase",jf());var bs=new Ze("@firebase/auth");function Kv(n,...e){bs.logLevel<=j.WARN&&bs.warn(`Auth (${tt}): ${n}`,...e)}function ws(n,...e){bs.logLevel<=j.ERROR&&bs.error(`Auth (${tt}): ${n}`,...e)}function We(n,...e){throw Kc(n,...e)}function rt(n,...e){return Kc(n,...e)}function Kf(n,e,t){let r=Object.assign(Object.assign({},zf()),{[e]:t});return new ye("auth","Firebase",r).create(e,{appName:n.name})}function sn(n){return Kf(n,"operation-not-supported-in-this-environment","Operations that alter the current user are not supported in conjunction with FirebaseServerApp")}function Kc(n,...e){if(typeof n!="string"){let t=e[0],r=[...e.slice(1)];return r[0]&&(r[0].appName=n.name),n._errorFactory.create(t,...r)}return $f.create(n,...e)}function x(n,e,...t){if(!n)throw Kc(e,...t)}function nt(n){let e="INTERNAL ASSERTION FAILED: "+n;throw ws(e),new Error(e)}function It(n,e){n||nt(e)}function Rc(){var n;return typeof self<"u"&&((n=self.location)===null||n===void 0?void 0:n.href)||""}function Gv(){return bf()==="http:"||bf()==="https:"}function bf(){var n;return typeof self<"u"&&((n=self.location)===null||n===void 0?void 0:n.protocol)||null}function Hv(){return typeof navigator<"u"&&navigator&&"onLine"in navigator&&typeof navigator.onLine=="boolean"&&(Gv()||Br()||"connection"in navigator)?navigator.onLine:!0}function Wv(){if(typeof navigator>"u")return null;let n=navigator;return n.languages&&n.languages[0]||n.language||null}var on=class{constructor(e,t){this.shortDelay=e,this.longDelay=t,It(t>e,"Short delay should be less than long delay!"),this.isMobile=Pd()||Cd()}get(){return Hv()?this.isMobile?this.longDelay:this.shortDelay:Math.min(5e3,this.shortDelay)}};function Gc(n,e){It(n.emulator,"Emulator should always be set here");let{url:t}=n.emulator;return e?`${t}${e.startsWith("/")?e.slice(1):e}`:t}var As=class{static initialize(e,t,r){this.fetchImpl=e,t&&(this.headersImpl=t),r&&(this.responseImpl=r)}static fetch(){if(this.fetchImpl)return this.fetchImpl;if(typeof self<"u"&&"fetch"in self)return self.fetch;if(typeof globalThis<"u"&&globalThis.fetch)return globalThis.fetch;if(typeof fetch<"u")return fetch;nt("Could not find fetch implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static headers(){if(this.headersImpl)return this.headersImpl;if(typeof self<"u"&&"Headers"in self)return self.Headers;if(typeof globalThis<"u"&&globalThis.Headers)return globalThis.Headers;if(typeof Headers<"u")return Headers;nt("Could not find Headers implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static response(){if(this.responseImpl)return this.responseImpl;if(typeof self<"u"&&"Response"in self)return self.Response;if(typeof globalThis<"u"&&globalThis.Response)return globalThis.Response;if(typeof Response<"u")return Response;nt("Could not find Response implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}};var Qv={CREDENTIAL_MISMATCH:"custom-token-mismatch",MISSING_CUSTOM_TOKEN:"internal-error",INVALID_IDENTIFIER:"invalid-email",MISSING_CONTINUE_URI:"internal-error",INVALID_PASSWORD:"wrong-password",MISSING_PASSWORD:"missing-password",INVALID_LOGIN_CREDENTIALS:"invalid-credential",EMAIL_EXISTS:"email-already-in-use",PASSWORD_LOGIN_DISABLED:"operation-not-allowed",INVALID_IDP_RESPONSE:"invalid-credential",INVALID_PENDING_TOKEN:"invalid-credential",FEDERATED_USER_ID_ALREADY_LINKED:"credential-already-in-use",MISSING_REQ_TYPE:"internal-error",EMAIL_NOT_FOUND:"user-not-found",RESET_PASSWORD_EXCEED_LIMIT:"too-many-requests",EXPIRED_OOB_CODE:"expired-action-code",INVALID_OOB_CODE:"invalid-action-code",MISSING_OOB_CODE:"internal-error",CREDENTIAL_TOO_OLD_LOGIN_AGAIN:"requires-recent-login",INVALID_ID_TOKEN:"invalid-user-token",TOKEN_EXPIRED:"user-token-expired",USER_NOT_FOUND:"user-token-expired",TOO_MANY_ATTEMPTS_TRY_LATER:"too-many-requests",PASSWORD_DOES_NOT_MEET_REQUIREMENTS:"password-does-not-meet-requirements",INVALID_CODE:"invalid-verification-code",INVALID_SESSION_INFO:"invalid-verification-id",INVALID_TEMPORARY_PROOF:"invalid-credential",MISSING_SESSION_INFO:"missing-verification-id",SESSION_EXPIRED:"code-expired",MISSING_ANDROID_PACKAGE_NAME:"missing-android-pkg-name",UNAUTHORIZED_DOMAIN:"unauthorized-continue-uri",INVALID_OAUTH_CLIENT_ID:"invalid-oauth-client-id",ADMIN_ONLY_OPERATION:"admin-restricted-operation",INVALID_MFA_PENDING_CREDENTIAL:"invalid-multi-factor-session",MFA_ENROLLMENT_NOT_FOUND:"multi-factor-info-not-found",MISSING_MFA_ENROLLMENT_ID:"missing-multi-factor-info",MISSING_MFA_PENDING_CREDENTIAL:"missing-multi-factor-session",SECOND_FACTOR_EXISTS:"second-factor-already-in-use",SECOND_FACTOR_LIMIT_EXCEEDED:"maximum-second-factor-count-exceeded",BLOCKING_FUNCTION_ERROR_RESPONSE:"internal-error",RECAPTCHA_NOT_ENABLED:"recaptcha-not-enabled",MISSING_RECAPTCHA_TOKEN:"missing-recaptcha-token",INVALID_RECAPTCHA_TOKEN:"invalid-recaptcha-token",INVALID_RECAPTCHA_ACTION:"invalid-recaptcha-action",MISSING_CLIENT_TYPE:"missing-client-type",MISSING_RECAPTCHA_VERSION:"missing-recaptcha-version",INVALID_RECAPTCHA_VERSION:"invalid-recaptcha-version",INVALID_REQ_TYPE:"invalid-req-type"};var Yv=new on(3e4,6e4);function me(n,e){return n.tenantId&&!e.tenantId?Object.assign(Object.assign({},e),{tenantId:n.tenantId}):e}async function be(n,e,t,r,i={}){return Gf(n,i,async()=>{let s={},a={};r&&(e==="GET"?a=r:s={body:JSON.stringify(r)});let c=Vn(Object.assign({key:n.config.apiKey},a)).slice(1),u=await n._getAdditionalHeaders();u["Content-Type"]="application/json",n.languageCode&&(u["X-Firebase-Locale"]=n.languageCode);let d=Object.assign({method:e,headers:u},s);return kd()||(d.referrerPolicy="no-referrer"),As.fetch()(Hf(n,n.config.apiHost,t,c),d)})}async function Gf(n,e,t){n._canInitEmulator=!1;let r=Object.assign(Object.assign({},Qv),e);try{let i=new Pc(n),s=await Promise.race([t(),i.promise]);i.clearNetworkTimeout();let a=await s.json();if("needConfirmation"in a)throw Gr(n,"account-exists-with-different-credential",a);if(s.ok&&!("errorMessage"in a))return a;{let c=s.ok?a.errorMessage:a.error.message,[u,d]=c.split(" : ");if(u==="FEDERATED_USER_ID_ALREADY_LINKED")throw Gr(n,"credential-already-in-use",a);if(u==="EMAIL_EXISTS")throw Gr(n,"email-already-in-use",a);if(u==="USER_DISABLED")throw Gr(n,"user-disabled",a);let f=r[u]||u.toLowerCase().replace(/[_\s]+/g,"-");if(d)throw Kf(n,f,d);We(n,f)}}catch(i){if(i instanceof he)throw i;We(n,"network-request-failed",{message:String(i)})}}async function hn(n,e,t,r,i={}){let s=await be(n,e,t,r,i);return"mfaPendingCredential"in s&&We(n,"multi-factor-auth-required",{_serverResponse:s}),s}function Hf(n,e,t,r){let i=`${e}${t}?${r}`;return n.config.emulator?Gc(n.config,i):`${n.config.apiScheme}://${i}`}function Jv(n){switch(n){case"ENFORCE":return"ENFORCE";case"AUDIT":return"AUDIT";case"OFF":return"OFF";default:return"ENFORCEMENT_STATE_UNSPECIFIED"}}var Pc=class{clearNetworkTimeout(){clearTimeout(this.timer)}constructor(e){this.auth=e,this.timer=null,this.promise=new Promise((t,r)=>{this.timer=setTimeout(()=>r(rt(this.auth,"network-request-failed")),Yv.get())})}};function Gr(n,e,t){let r={appName:n.name};t.email&&(r.email=t.email),t.phoneNumber&&(r.phoneNumber=t.phoneNumber);let i=rt(n,e,r);return i.customData._tokenResponse=t,i}function Af(n){return n!==void 0&&n.enterprise!==void 0}var Ss=class{constructor(e){if(this.siteKey="",this.recaptchaEnforcementState=[],e.recaptchaKey===void 0)throw new Error("recaptchaKey undefined");this.siteKey=e.recaptchaKey.split("/")[3],this.recaptchaEnforcementState=e.recaptchaEnforcementState}getProviderEnforcementState(e){if(!this.recaptchaEnforcementState||this.recaptchaEnforcementState.length===0)return null;for(let t of this.recaptchaEnforcementState)if(t.provider&&t.provider===e)return Jv(t.enforcementState);return null}isProviderEnabled(e){return this.getProviderEnforcementState(e)==="ENFORCE"||this.getProviderEnforcementState(e)==="AUDIT"}isAnyProviderEnabled(){return this.isProviderEnabled("EMAIL_PASSWORD_PROVIDER")||this.isProviderEnabled("PHONE_PROVIDER")}};async function Wf(n,e){return be(n,"GET","/v2/recaptchaConfig",me(n,e))}async function Xv(n,e){return be(n,"POST","/v1/accounts:delete",e)}async function Qf(n,e){return be(n,"POST","/v1/accounts:lookup",e)}function Hr(n){if(n)try{let e=new Date(Number(n));if(!isNaN(e.getTime()))return e.toUTCString()}catch{}}async function Yf(n,e=!1){let t=de(n),r=await t.getIdToken(e),i=Hc(r);x(i&&i.exp&&i.auth_time&&i.iat,t.auth,"internal-error");let s=typeof i.firebase=="object"?i.firebase:void 0,a=s?.sign_in_provider;return{claims:i,token:r,authTime:Hr(bc(i.auth_time)),issuedAtTime:Hr(bc(i.iat)),expirationTime:Hr(bc(i.exp)),signInProvider:a||null,signInSecondFactor:s?.sign_in_second_factor||null}}function bc(n){return Number(n)*1e3}function Hc(n){let[e,t,r]=n.split(".");if(e===void 0||t===void 0||r===void 0)return ws("JWT malformed, contained fewer than 3 sections"),null;try{let i=os(t);return i?JSON.parse(i):(ws("Failed to decode base64 JWT payload"),null)}catch(i){return ws("Caught error parsing JWT payload as JSON",i?.toString()),null}}function Sf(n){let e=Hc(n);return x(e,"internal-error"),x(typeof e.exp<"u","internal-error"),x(typeof e.iat<"u","internal-error"),Number(e.exp)-Number(e.iat)}async function Jr(n,e,t=!1){if(t)return e;try{return await e}catch(r){throw r instanceof he&&Zv(r)&&n.auth.currentUser===n&&await n.auth.signOut(),r}}function Zv({code:n}){return n==="auth/user-disabled"||n==="auth/user-token-expired"}var kc=class{constructor(e){this.user=e,this.isRunning=!1,this.timerId=null,this.errorBackoff=3e4}_start(){this.isRunning||(this.isRunning=!0,this.schedule())}_stop(){this.isRunning&&(this.isRunning=!1,this.timerId!==null&&clearTimeout(this.timerId))}getInterval(e){var t;if(e){let r=this.errorBackoff;return this.errorBackoff=Math.min(this.errorBackoff*2,96e4),r}else{this.errorBackoff=3e4;let i=((t=this.user.stsTokenManager.expirationTime)!==null&&t!==void 0?t:0)-Date.now()-3e5;return Math.max(0,i)}}schedule(e=!1){if(!this.isRunning)return;let t=this.getInterval(e);this.timerId=setTimeout(async()=>{await this.iteration()},t)}async iteration(){try{await this.user.getIdToken(!0)}catch(e){e?.code==="auth/network-request-failed"&&this.schedule(!0);return}this.schedule()}};var Xr=class{constructor(e,t){this.createdAt=e,this.lastLoginAt=t,this._initializeTime()}_initializeTime(){this.lastSignInTime=Hr(this.lastLoginAt),this.creationTime=Hr(this.createdAt)}_copy(e){this.createdAt=e.createdAt,this.lastLoginAt=e.lastLoginAt,this._initializeTime()}toJSON(){return{createdAt:this.createdAt,lastLoginAt:this.lastLoginAt}}};async function Rs(n){var e;let t=n.auth,r=await n.getIdToken(),i=await Jr(n,Qf(t,{idToken:r}));x(i?.users.length,t,"internal-error");let s=i.users[0];n._notifyReloadListener(s);let a=!((e=s.providerUserInfo)===null||e===void 0)&&e.length?Xf(s.providerUserInfo):[],c=eI(n.providerData,a),u=n.isAnonymous,d=!(n.email&&s.passwordHash)&&!c?.length,f=u?d:!1,g={uid:s.localId,displayName:s.displayName||null,photoURL:s.photoUrl||null,email:s.email||null,emailVerified:s.emailVerified||!1,phoneNumber:s.phoneNumber||null,tenantId:s.tenantId||null,providerData:c,metadata:new Xr(s.createdAt,s.lastLoginAt),isAnonymous:f};Object.assign(n,g)}async function Jf(n){let e=de(n);await Rs(e),await e.auth._persistUserIfCurrent(e),e.auth._notifyListenersIfCurrent(e)}function eI(n,e){return[...n.filter(r=>!e.some(i=>i.providerId===r.providerId)),...e]}function Xf(n){return n.map(e=>{var{providerId:t}=e,r=_s(e,["providerId"]);return{providerId:t,uid:r.rawId||"",displayName:r.displayName||null,email:r.email||null,phoneNumber:r.phoneNumber||null,photoURL:r.photoUrl||null}})}async function tI(n,e){let t=await Gf(n,{},async()=>{let r=Vn({grant_type:"refresh_token",refresh_token:e}).slice(1),{tokenApiHost:i,apiKey:s}=n.config,a=Hf(n,i,"/v1/token",`key=${s}`),c=await n._getAdditionalHeaders();return c["Content-Type"]="application/x-www-form-urlencoded",As.fetch()(a,{method:"POST",headers:c,body:r})});return{accessToken:t.access_token,expiresIn:t.expires_in,refreshToken:t.refresh_token}}async function nI(n,e){return be(n,"POST","/v2/accounts:revokeToken",me(n,e))}var Wr=class n{constructor(){this.refreshToken=null,this.accessToken=null,this.expirationTime=null}get isExpired(){return!this.expirationTime||Date.now()>this.expirationTime-3e4}updateFromServerResponse(e){x(e.idToken,"internal-error"),x(typeof e.idToken<"u","internal-error"),x(typeof e.refreshToken<"u","internal-error");let t="expiresIn"in e&&typeof e.expiresIn<"u"?Number(e.expiresIn):Sf(e.idToken);this.updateTokensAndExpiration(e.idToken,e.refreshToken,t)}updateFromIdToken(e){x(e.length!==0,"internal-error");let t=Sf(e);this.updateTokensAndExpiration(e,null,t)}async getToken(e,t=!1){return!t&&this.accessToken&&!this.isExpired?this.accessToken:(x(this.refreshToken,e,"user-token-expired"),this.refreshToken?(await this.refresh(e,this.refreshToken),this.accessToken):null)}clearRefreshToken(){this.refreshToken=null}async refresh(e,t){let{accessToken:r,refreshToken:i,expiresIn:s}=await tI(e,t);this.updateTokensAndExpiration(r,i,Number(s))}updateTokensAndExpiration(e,t,r){this.refreshToken=t||null,this.accessToken=e||null,this.expirationTime=Date.now()+r*1e3}static fromJSON(e,t){let{refreshToken:r,accessToken:i,expirationTime:s}=t,a=new n;return r&&(x(typeof r=="string","internal-error",{appName:e}),a.refreshToken=r),i&&(x(typeof i=="string","internal-error",{appName:e}),a.accessToken=i),s&&(x(typeof s=="number","internal-error",{appName:e}),a.expirationTime=s),a}toJSON(){return{refreshToken:this.refreshToken,accessToken:this.accessToken,expirationTime:this.expirationTime}}_assign(e){this.accessToken=e.accessToken,this.refreshToken=e.refreshToken,this.expirationTime=e.expirationTime}_clone(){return Object.assign(new n,this.toJSON())}_performRefresh(){return nt("not implemented")}};function xt(n,e){x(typeof n=="string"||typeof n>"u","internal-error",{appName:e})}var Un=class n{constructor(e){var{uid:t,auth:r,stsTokenManager:i}=e,s=_s(e,["uid","auth","stsTokenManager"]);this.providerId="firebase",this.proactiveRefresh=new kc(this),this.reloadUserInfo=null,this.reloadListener=null,this.uid=t,this.auth=r,this.stsTokenManager=i,this.accessToken=i.accessToken,this.displayName=s.displayName||null,this.email=s.email||null,this.emailVerified=s.emailVerified||!1,this.phoneNumber=s.phoneNumber||null,this.photoURL=s.photoURL||null,this.isAnonymous=s.isAnonymous||!1,this.tenantId=s.tenantId||null,this.providerData=s.providerData?[...s.providerData]:[],this.metadata=new Xr(s.createdAt||void 0,s.lastLoginAt||void 0)}async getIdToken(e){let t=await Jr(this,this.stsTokenManager.getToken(this.auth,e));return x(t,this.auth,"internal-error"),this.accessToken!==t&&(this.accessToken=t,await this.auth._persistUserIfCurrent(this),this.auth._notifyListenersIfCurrent(this)),t}getIdTokenResult(e){return Yf(this,e)}reload(){return Jf(this)}_assign(e){this!==e&&(x(this.uid===e.uid,this.auth,"internal-error"),this.displayName=e.displayName,this.photoURL=e.photoURL,this.email=e.email,this.emailVerified=e.emailVerified,this.phoneNumber=e.phoneNumber,this.isAnonymous=e.isAnonymous,this.tenantId=e.tenantId,this.providerData=e.providerData.map(t=>Object.assign({},t)),this.metadata._copy(e.metadata),this.stsTokenManager._assign(e.stsTokenManager))}_clone(e){let t=new n(Object.assign(Object.assign({},this),{auth:e,stsTokenManager:this.stsTokenManager._clone()}));return t.metadata._copy(this.metadata),t}_onReload(e){x(!this.reloadListener,this.auth,"internal-error"),this.reloadListener=e,this.reloadUserInfo&&(this._notifyReloadListener(this.reloadUserInfo),this.reloadUserInfo=null)}_notifyReloadListener(e){this.reloadListener?this.reloadListener(e):this.reloadUserInfo=e}_startProactiveRefresh(){this.proactiveRefresh._start()}_stopProactiveRefresh(){this.proactiveRefresh._stop()}async _updateTokensIfNecessary(e,t=!1){let r=!1;e.idToken&&e.idToken!==this.stsTokenManager.accessToken&&(this.stsTokenManager.updateFromServerResponse(e),r=!0),t&&await Rs(this),await this.auth._persistUserIfCurrent(this),r&&this.auth._notifyListenersIfCurrent(this)}async delete(){if(Ne(this.auth.app))return Promise.reject(sn(this.auth));let e=await this.getIdToken();return await Jr(this,Xv(this.auth,{idToken:e})),this.stsTokenManager.clearRefreshToken(),this.auth.signOut()}toJSON(){return Object.assign(Object.assign({uid:this.uid,email:this.email||void 0,emailVerified:this.emailVerified,displayName:this.displayName||void 0,isAnonymous:this.isAnonymous,photoURL:this.photoURL||void 0,phoneNumber:this.phoneNumber||void 0,tenantId:this.tenantId||void 0,providerData:this.providerData.map(e=>Object.assign({},e)),stsTokenManager:this.stsTokenManager.toJSON(),_redirectEventId:this._redirectEventId},this.metadata.toJSON()),{apiKey:this.auth.config.apiKey,appName:this.auth.name})}get refreshToken(){return this.stsTokenManager.refreshToken||""}static _fromJSON(e,t){var r,i,s,a,c,u,d,f;let g=(r=t.displayName)!==null&&r!==void 0?r:void 0,b=(i=t.email)!==null&&i!==void 0?i:void 0,R=(s=t.phoneNumber)!==null&&s!==void 0?s:void 0,k=(a=t.photoURL)!==null&&a!==void 0?a:void 0,O=(c=t.tenantId)!==null&&c!==void 0?c:void 0,N=(u=t._redirectEventId)!==null&&u!==void 0?u:void 0,Y=(d=t.createdAt)!==null&&d!==void 0?d:void 0,z=(f=t.lastLoginAt)!==null&&f!==void 0?f:void 0,{uid:L,emailVerified:B,isAnonymous:H,providerData:q,stsTokenManager:w}=t;x(L&&w,e,"internal-error");let m=Wr.fromJSON(this.name,w);x(typeof L=="string",e,"internal-error"),xt(g,e.name),xt(b,e.name),x(typeof B=="boolean",e,"internal-error"),x(typeof H=="boolean",e,"internal-error"),xt(R,e.name),xt(k,e.name),xt(O,e.name),xt(N,e.name),xt(Y,e.name),xt(z,e.name);let y=new n({uid:L,auth:e,email:b,emailVerified:B,displayName:g,isAnonymous:H,photoURL:k,phoneNumber:R,tenantId:O,stsTokenManager:m,createdAt:Y,lastLoginAt:z});return q&&Array.isArray(q)&&(y.providerData=q.map(v=>Object.assign({},v))),N&&(y._redirectEventId=N),y}static async _fromIdTokenResponse(e,t,r=!1){let i=new Wr;i.updateFromServerResponse(t);let s=new n({uid:t.localId,auth:e,stsTokenManager:i,isAnonymous:r});return await Rs(s),s}static async _fromGetAccountInfoResponse(e,t,r){let i=t.users[0];x(i.localId!==void 0,"internal-error");let s=i.providerUserInfo!==void 0?Xf(i.providerUserInfo):[],a=!(i.email&&i.passwordHash)&&!s?.length,c=new Wr;c.updateFromIdToken(r);let u=new n({uid:i.localId,auth:e,stsTokenManager:c,isAnonymous:a}),d={uid:i.localId,displayName:i.displayName||null,photoURL:i.photoUrl||null,email:i.email||null,emailVerified:i.emailVerified||!1,phoneNumber:i.phoneNumber||null,tenantId:i.tenantId||null,providerData:s,metadata:new Xr(i.createdAt,i.lastLoginAt),isAnonymous:!(i.email&&i.passwordHash)&&!s?.length};return Object.assign(u,d),u}};var Rf=new Map;function vt(n){It(n instanceof Function,"Expected a class definition");let e=Rf.get(n);return e?(It(e instanceof n,"Instance stored in cache mismatched with class"),e):(e=new n,Rf.set(n,e),e)}var Ps=class{constructor(){this.type="NONE",this.storage={}}async _isAvailable(){return!0}async _set(e,t){this.storage[e]=t}async _get(e){let t=this.storage[e];return t===void 0?null:t}async _remove(e){delete this.storage[e]}_addListener(e,t){}_removeListener(e,t){}};Ps.type="NONE";var Cc=Ps;function vs(n,e,t){return`firebase:${n}:${e}:${t}`}var ks=class n{constructor(e,t,r){this.persistence=e,this.auth=t,this.userKey=r;let{config:i,name:s}=this.auth;this.fullUserKey=vs(this.userKey,i.apiKey,s),this.fullPersistenceKey=vs("persistence",i.apiKey,s),this.boundEventHandler=t._onStorageEvent.bind(t),this.persistence._addListener(this.fullUserKey,this.boundEventHandler)}setCurrentUser(e){return this.persistence._set(this.fullUserKey,e.toJSON())}async getCurrentUser(){let e=await this.persistence._get(this.fullUserKey);return e?Un._fromJSON(this.auth,e):null}removeCurrentUser(){return this.persistence._remove(this.fullUserKey)}savePersistenceForRedirect(){return this.persistence._set(this.fullPersistenceKey,this.persistence.type)}async setPersistence(e){if(this.persistence===e)return;let t=await this.getCurrentUser();if(await this.removeCurrentUser(),this.persistence=e,t)return this.setCurrentUser(t)}delete(){this.persistence._removeListener(this.fullUserKey,this.boundEventHandler)}static async create(e,t,r="authUser"){if(!t.length)return new n(vt(Cc),e,r);let i=(await Promise.all(t.map(async d=>{if(await d._isAvailable())return d}))).filter(d=>d),s=i[0]||vt(Cc),a=vs(r,e.config.apiKey,e.name),c=null;for(let d of t)try{let f=await d._get(a);if(f){let g=Un._fromJSON(e,f);d!==s&&(c=g),s=d;break}}catch{}let u=i.filter(d=>d._shouldAllowMigration);return!s._shouldAllowMigration||!u.length?new n(s,e,r):(s=u[0],c&&await s._set(a,c.toJSON()),await Promise.all(t.map(async d=>{if(d!==s)try{await d._remove(a)}catch{}})),new n(s,e,r))}};function Pf(n){let e=n.toLowerCase();if(e.includes("opera/")||e.includes("opr/")||e.includes("opios/"))return"Opera";if(np(e))return"IEMobile";if(e.includes("msie")||e.includes("trident/"))return"IE";if(e.includes("edge/"))return"Edge";if(Zf(e))return"Firefox";if(e.includes("silk/"))return"Silk";if(ip(e))return"Blackberry";if(sp(e))return"Webos";if(ep(e))return"Safari";if((e.includes("chrome/")||tp(e))&&!e.includes("edge/"))return"Chrome";if(rp(e))return"Android";{let t=/([a-zA-Z\d\.]+)\/[a-zA-Z\d\.]*$/,r=n.match(t);if(r?.length===2)return r[1]}return"Other"}function Zf(n=se()){return/firefox\//i.test(n)}function ep(n=se()){let e=n.toLowerCase();return e.includes("safari/")&&!e.includes("chrome/")&&!e.includes("crios/")&&!e.includes("android")}function tp(n=se()){return/crios\//i.test(n)}function np(n=se()){return/iemobile/i.test(n)}function rp(n=se()){return/android/i.test(n)}function ip(n=se()){return/blackberry/i.test(n)}function sp(n=se()){return/webos/i.test(n)}function Wc(n=se()){return/iphone|ipad|ipod/i.test(n)||/macintosh/i.test(n)&&/mobile/i.test(n)}function rI(n=se()){var e;return Wc(n)&&!!(!((e=window.navigator)===null||e===void 0)&&e.standalone)}function iI(){return Dd()&&document.documentMode===10}function op(n=se()){return Wc(n)||rp(n)||sp(n)||ip(n)||/windows phone/i.test(n)||np(n)}function ap(n,e=[]){let t;switch(n){case"Browser":t=Pf(se());break;case"Worker":t=`${Pf(se())}-${n}`;break;default:t=n}let r=e.length?e.join(","):"FirebaseCore-web";return`${t}/JsCore/${tt}/${r}`}var Dc=class{constructor(e){this.auth=e,this.queue=[]}pushCallback(e,t){let r=s=>new Promise((a,c)=>{try{let u=e(s);a(u)}catch(u){c(u)}});r.onAbort=t,this.queue.push(r);let i=this.queue.length-1;return()=>{this.queue[i]=()=>Promise.resolve()}}async runMiddleware(e){if(this.auth.currentUser===e)return;let t=[];try{for(let r of this.queue)await r(e),r.onAbort&&t.push(r.onAbort)}catch(r){t.reverse();for(let i of t)try{i()}catch{}throw this.auth._errorFactory.create("login-blocked",{originalMessage:r?.message})}}};async function sI(n,e={}){return be(n,"GET","/v2/passwordPolicy",me(n,e))}var oI=6,Nc=class{constructor(e){var t,r,i,s;let a=e.customStrengthOptions;this.customStrengthOptions={},this.customStrengthOptions.minPasswordLength=(t=a.minPasswordLength)!==null&&t!==void 0?t:oI,a.maxPasswordLength&&(this.customStrengthOptions.maxPasswordLength=a.maxPasswordLength),a.containsLowercaseCharacter!==void 0&&(this.customStrengthOptions.containsLowercaseLetter=a.containsLowercaseCharacter),a.containsUppercaseCharacter!==void 0&&(this.customStrengthOptions.containsUppercaseLetter=a.containsUppercaseCharacter),a.containsNumericCharacter!==void 0&&(this.customStrengthOptions.containsNumericCharacter=a.containsNumericCharacter),a.containsNonAlphanumericCharacter!==void 0&&(this.customStrengthOptions.containsNonAlphanumericCharacter=a.containsNonAlphanumericCharacter),this.enforcementState=e.enforcementState,this.enforcementState==="ENFORCEMENT_STATE_UNSPECIFIED"&&(this.enforcementState="OFF"),this.allowedNonAlphanumericCharacters=(i=(r=e.allowedNonAlphanumericCharacters)===null||r===void 0?void 0:r.join(""))!==null&&i!==void 0?i:"",this.forceUpgradeOnSignin=(s=e.forceUpgradeOnSignin)!==null&&s!==void 0?s:!1,this.schemaVersion=e.schemaVersion}validatePassword(e){var t,r,i,s,a,c;let u={isValid:!0,passwordPolicy:this};return this.validatePasswordLengthOptions(e,u),this.validatePasswordCharacterOptions(e,u),u.isValid&&(u.isValid=(t=u.meetsMinPasswordLength)!==null&&t!==void 0?t:!0),u.isValid&&(u.isValid=(r=u.meetsMaxPasswordLength)!==null&&r!==void 0?r:!0),u.isValid&&(u.isValid=(i=u.containsLowercaseLetter)!==null&&i!==void 0?i:!0),u.isValid&&(u.isValid=(s=u.containsUppercaseLetter)!==null&&s!==void 0?s:!0),u.isValid&&(u.isValid=(a=u.containsNumericCharacter)!==null&&a!==void 0?a:!0),u.isValid&&(u.isValid=(c=u.containsNonAlphanumericCharacter)!==null&&c!==void 0?c:!0),u}validatePasswordLengthOptions(e,t){let r=this.customStrengthOptions.minPasswordLength,i=this.customStrengthOptions.maxPasswordLength;r&&(t.meetsMinPasswordLength=e.length>=r),i&&(t.meetsMaxPasswordLength=e.length<=i)}validatePasswordCharacterOptions(e,t){this.updatePasswordCharacterOptionsStatuses(t,!1,!1,!1,!1);let r;for(let i=0;i<e.length;i++)r=e.charAt(i),this.updatePasswordCharacterOptionsStatuses(t,r>="a"&&r<="z",r>="A"&&r<="Z",r>="0"&&r<="9",this.allowedNonAlphanumericCharacters.includes(r))}updatePasswordCharacterOptionsStatuses(e,t,r,i,s){this.customStrengthOptions.containsLowercaseLetter&&(e.containsLowercaseLetter||(e.containsLowercaseLetter=t)),this.customStrengthOptions.containsUppercaseLetter&&(e.containsUppercaseLetter||(e.containsUppercaseLetter=r)),this.customStrengthOptions.containsNumericCharacter&&(e.containsNumericCharacter||(e.containsNumericCharacter=i)),this.customStrengthOptions.containsNonAlphanumericCharacter&&(e.containsNonAlphanumericCharacter||(e.containsNonAlphanumericCharacter=s))}};var Oc=class{constructor(e,t,r,i){this.app=e,this.heartbeatServiceProvider=t,this.appCheckServiceProvider=r,this.config=i,this.currentUser=null,this.emulatorConfig=null,this.operations=Promise.resolve(),this.authStateSubscription=new Cs(this),this.idTokenSubscription=new Cs(this),this.beforeStateQueue=new Dc(this),this.redirectUser=null,this.isProactiveRefreshEnabled=!1,this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION=1,this._canInitEmulator=!0,this._isInitialized=!1,this._deleted=!1,this._initializationPromise=null,this._popupRedirectResolver=null,this._errorFactory=$f,this._agentRecaptchaConfig=null,this._tenantRecaptchaConfigs={},this._projectPasswordPolicy=null,this._tenantPasswordPolicies={},this.lastNotifiedUid=void 0,this.languageCode=null,this.tenantId=null,this.settings={appVerificationDisabledForTesting:!1},this.frameworks=[],this.name=e.name,this.clientVersion=i.sdkClientVersion}_initializeWithPersistence(e,t){return t&&(this._popupRedirectResolver=vt(t)),this._initializationPromise=this.queue(async()=>{var r,i;if(!this._deleted&&(this.persistenceManager=await ks.create(this,e),!this._deleted)){if(!((r=this._popupRedirectResolver)===null||r===void 0)&&r._shouldInitProactively)try{await this._popupRedirectResolver._initialize(this)}catch{}await this.initializeCurrentUser(t),this.lastNotifiedUid=((i=this.currentUser)===null||i===void 0?void 0:i.uid)||null,!this._deleted&&(this._isInitialized=!0)}}),this._initializationPromise}async _onStorageEvent(){if(this._deleted)return;let e=await this.assertedPersistence.getCurrentUser();if(!(!this.currentUser&&!e)){if(this.currentUser&&e&&this.currentUser.uid===e.uid){this._currentUser._assign(e),await this.currentUser.getIdToken();return}await this._updateCurrentUser(e,!0)}}async initializeCurrentUserFromIdToken(e){try{let t=await Qf(this,{idToken:e}),r=await Un._fromGetAccountInfoResponse(this,t,e);await this.directlySetCurrentUser(r)}catch(t){console.warn("FirebaseServerApp could not login user with provided authIdToken: ",t),await this.directlySetCurrentUser(null)}}async initializeCurrentUser(e){var t;if(Ne(this.app)){let a=this.app.settings.authIdToken;return a?new Promise(c=>{setTimeout(()=>this.initializeCurrentUserFromIdToken(a).then(c,c))}):this.directlySetCurrentUser(null)}let r=await this.assertedPersistence.getCurrentUser(),i=r,s=!1;if(e&&this.config.authDomain){await this.getOrInitRedirectPersistenceManager();let a=(t=this.redirectUser)===null||t===void 0?void 0:t._redirectEventId,c=i?._redirectEventId,u=await this.tryRedirectSignIn(e);(!a||a===c)&&u?.user&&(i=u.user,s=!0)}if(!i)return this.directlySetCurrentUser(null);if(!i._redirectEventId){if(s)try{await this.beforeStateQueue.runMiddleware(i)}catch(a){i=r,this._popupRedirectResolver._overrideRedirectResult(this,()=>Promise.reject(a))}return i?this.reloadAndSetCurrentUserOrClear(i):this.directlySetCurrentUser(null)}return x(this._popupRedirectResolver,this,"argument-error"),await this.getOrInitRedirectPersistenceManager(),this.redirectUser&&this.redirectUser._redirectEventId===i._redirectEventId?this.directlySetCurrentUser(i):this.reloadAndSetCurrentUserOrClear(i)}async tryRedirectSignIn(e){let t=null;try{t=await this._popupRedirectResolver._completeRedirectFn(this,e,!0)}catch{await this._setRedirectUser(null)}return t}async reloadAndSetCurrentUserOrClear(e){try{await Rs(e)}catch(t){if(t?.code!=="auth/network-request-failed")return this.directlySetCurrentUser(null)}return this.directlySetCurrentUser(e)}useDeviceLanguage(){this.languageCode=Wv()}async _delete(){this._deleted=!0}async updateCurrentUser(e){if(Ne(this.app))return Promise.reject(sn(this));let t=e?de(e):null;return t&&x(t.auth.config.apiKey===this.config.apiKey,this,"invalid-user-token"),this._updateCurrentUser(t&&t._clone(this))}async _updateCurrentUser(e,t=!1){if(!this._deleted)return e&&x(this.tenantId===e.tenantId,this,"tenant-id-mismatch"),t||await this.beforeStateQueue.runMiddleware(e),this.queue(async()=>{await this.directlySetCurrentUser(e),this.notifyAuthListeners()})}async signOut(){return Ne(this.app)?Promise.reject(sn(this)):(await this.beforeStateQueue.runMiddleware(null),(this.redirectPersistenceManager||this._popupRedirectResolver)&&await this._setRedirectUser(null),this._updateCurrentUser(null,!0))}setPersistence(e){return Ne(this.app)?Promise.reject(sn(this)):this.queue(async()=>{await this.assertedPersistence.setPersistence(vt(e))})}_getRecaptchaConfig(){return this.tenantId==null?this._agentRecaptchaConfig:this._tenantRecaptchaConfigs[this.tenantId]}async validatePassword(e){this._getPasswordPolicyInternal()||await this._updatePasswordPolicy();let t=this._getPasswordPolicyInternal();return t.schemaVersion!==this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION?Promise.reject(this._errorFactory.create("unsupported-password-policy-schema-version",{})):t.validatePassword(e)}_getPasswordPolicyInternal(){return this.tenantId===null?this._projectPasswordPolicy:this._tenantPasswordPolicies[this.tenantId]}async _updatePasswordPolicy(){let e=await sI(this),t=new Nc(e);this.tenantId===null?this._projectPasswordPolicy=t:this._tenantPasswordPolicies[this.tenantId]=t}_getPersistence(){return this.assertedPersistence.persistence.type}_updateErrorMap(e){this._errorFactory=new ye("auth","Firebase",e())}onAuthStateChanged(e,t,r){return this.registerStateListener(this.authStateSubscription,e,t,r)}beforeAuthStateChanged(e,t){return this.beforeStateQueue.pushCallback(e,t)}onIdTokenChanged(e,t,r){return this.registerStateListener(this.idTokenSubscription,e,t,r)}authStateReady(){return new Promise((e,t)=>{if(this.currentUser)e();else{let r=this.onAuthStateChanged(()=>{r(),e()},t)}})}async revokeAccessToken(e){if(this.currentUser){let t=await this.currentUser.getIdToken(),r={providerId:"apple.com",tokenType:"ACCESS_TOKEN",token:e,idToken:t};this.tenantId!=null&&(r.tenantId=this.tenantId),await nI(this,r)}}toJSON(){var e;return{apiKey:this.config.apiKey,authDomain:this.config.authDomain,appName:this.name,currentUser:(e=this._currentUser)===null||e===void 0?void 0:e.toJSON()}}async _setRedirectUser(e,t){let r=await this.getOrInitRedirectPersistenceManager(t);return e===null?r.removeCurrentUser():r.setCurrentUser(e)}async getOrInitRedirectPersistenceManager(e){if(!this.redirectPersistenceManager){let t=e&&vt(e)||this._popupRedirectResolver;x(t,this,"argument-error"),this.redirectPersistenceManager=await ks.create(this,[vt(t._redirectPersistence)],"redirectUser"),this.redirectUser=await this.redirectPersistenceManager.getCurrentUser()}return this.redirectPersistenceManager}async _redirectUserForId(e){var t,r;return this._isInitialized&&await this.queue(async()=>{}),((t=this._currentUser)===null||t===void 0?void 0:t._redirectEventId)===e?this._currentUser:((r=this.redirectUser)===null||r===void 0?void 0:r._redirectEventId)===e?this.redirectUser:null}async _persistUserIfCurrent(e){if(e===this.currentUser)return this.queue(async()=>this.directlySetCurrentUser(e))}_notifyListenersIfCurrent(e){e===this.currentUser&&this.notifyAuthListeners()}_key(){return`${this.config.authDomain}:${this.config.apiKey}:${this.name}`}_startProactiveRefresh(){this.isProactiveRefreshEnabled=!0,this.currentUser&&this._currentUser._startProactiveRefresh()}_stopProactiveRefresh(){this.isProactiveRefreshEnabled=!1,this.currentUser&&this._currentUser._stopProactiveRefresh()}get _currentUser(){return this.currentUser}notifyAuthListeners(){var e,t;if(!this._isInitialized)return;this.idTokenSubscription.next(this.currentUser);let r=(t=(e=this.currentUser)===null||e===void 0?void 0:e.uid)!==null&&t!==void 0?t:null;this.lastNotifiedUid!==r&&(this.lastNotifiedUid=r,this.authStateSubscription.next(this.currentUser))}registerStateListener(e,t,r,i){if(this._deleted)return()=>{};let s=typeof t=="function"?t:t.next.bind(t),a=!1,c=this._isInitialized?Promise.resolve():this._initializationPromise;if(x(c,this,"internal-error"),c.then(()=>{a||s(this.currentUser)}),typeof t=="function"){let u=e.addObserver(t,r,i);return()=>{a=!0,u()}}else{let u=e.addObserver(t);return()=>{a=!0,u()}}}async directlySetCurrentUser(e){this.currentUser&&this.currentUser!==e&&this._currentUser._stopProactiveRefresh(),e&&this.isProactiveRefreshEnabled&&e._startProactiveRefresh(),this.currentUser=e,e?await this.assertedPersistence.setCurrentUser(e):await this.assertedPersistence.removeCurrentUser()}queue(e){return this.operations=this.operations.then(e,e),this.operations}get assertedPersistence(){return x(this.persistenceManager,this,"internal-error"),this.persistenceManager}_logFramework(e){!e||this.frameworks.includes(e)||(this.frameworks.push(e),this.frameworks.sort(),this.clientVersion=ap(this.config.clientPlatform,this._getFrameworks()))}_getFrameworks(){return this.frameworks}async _getAdditionalHeaders(){var e;let t={"X-Client-Version":this.clientVersion};this.app.options.appId&&(t["X-Firebase-gmpid"]=this.app.options.appId);let r=await((e=this.heartbeatServiceProvider.getImmediate({optional:!0}))===null||e===void 0?void 0:e.getHeartbeatsHeader());r&&(t["X-Firebase-Client"]=r);let i=await this._getAppCheckToken();return i&&(t["X-Firebase-AppCheck"]=i),t}async _getAppCheckToken(){var e;if(Ne(this.app)&&this.app.settings.appCheckToken)return this.app.settings.appCheckToken;let t=await((e=this.appCheckServiceProvider.getImmediate({optional:!0}))===null||e===void 0?void 0:e.getToken());return t?.error&&Kv(`Error while retrieving App Check token: ${t.error}`),t?.token}};function qn(n){return de(n)}var Cs=class{constructor(e){this.auth=e,this.observer=null,this.addObserver=Od(t=>this.observer=t)}get next(){return x(this.observer,this.auth,"internal-error"),this.observer.next.bind(this.observer)}};var Ws={async loadJS(){throw new Error("Unable to load external scripts")},recaptchaV2Script:"",recaptchaEnterpriseScript:"",gapiScript:""};function aI(n){Ws=n}function cp(n){return Ws.loadJS(n)}function cI(){return Ws.recaptchaEnterpriseScript}function uI(){return Ws.gapiScript}function up(n){return`__${n}${Math.floor(Math.random()*1e6)}`}var xc=class{constructor(){this.enterprise=new Vc}ready(e){e()}execute(e,t){return Promise.resolve("token")}render(e,t){return""}},Vc=class{ready(e){e()}execute(e,t){return Promise.resolve("token")}render(e,t){return""}};var lI="recaptcha-enterprise",Qr="NO_RECAPTCHA",Ds=class{constructor(e){this.type=lI,this.auth=qn(e)}async verify(e="verify",t=!1){async function r(s){if(!t){if(s.tenantId==null&&s._agentRecaptchaConfig!=null)return s._agentRecaptchaConfig.siteKey;if(s.tenantId!=null&&s._tenantRecaptchaConfigs[s.tenantId]!==void 0)return s._tenantRecaptchaConfigs[s.tenantId].siteKey}return new Promise(async(a,c)=>{Wf(s,{clientType:"CLIENT_TYPE_WEB",version:"RECAPTCHA_ENTERPRISE"}).then(u=>{if(u.recaptchaKey===void 0)c(new Error("recaptcha Enterprise site key undefined"));else{let d=new Ss(u);return s.tenantId==null?s._agentRecaptchaConfig=d:s._tenantRecaptchaConfigs[s.tenantId]=d,a(d.siteKey)}}).catch(u=>{c(u)})})}function i(s,a,c){let u=window.grecaptcha;Af(u)?u.enterprise.ready(()=>{u.enterprise.execute(s,{action:e}).then(d=>{a(d)}).catch(()=>{a(Qr)})}):c(Error("No reCAPTCHA enterprise script loaded."))}return this.auth.settings.appVerificationDisabledForTesting?new xc().execute("siteKey",{action:"verify"}):new Promise((s,a)=>{r(this.auth).then(c=>{if(!t&&Af(window.grecaptcha))i(c,s,a);else{if(typeof window>"u"){a(new Error("RecaptchaVerifier is only supported in browser"));return}let u=cI();u.length!==0&&(u+=c),cp(u).then(()=>{i(c,s,a)}).catch(d=>{a(d)})}}).catch(c=>{a(c)})})}};async function Kr(n,e,t,r=!1,i=!1){let s=new Ds(n),a;if(i)a=Qr;else try{a=await s.verify(t)}catch{a=await s.verify(t,!0)}let c=Object.assign({},e);if(t==="mfaSmsEnrollment"||t==="mfaSmsSignIn"){if("phoneEnrollmentInfo"in c){let u=c.phoneEnrollmentInfo.phoneNumber,d=c.phoneEnrollmentInfo.recaptchaToken;Object.assign(c,{phoneEnrollmentInfo:{phoneNumber:u,recaptchaToken:d,captchaResponse:a,clientType:"CLIENT_TYPE_WEB",recaptchaVersion:"RECAPTCHA_ENTERPRISE"}})}else if("phoneSignInInfo"in c){let u=c.phoneSignInInfo.recaptchaToken;Object.assign(c,{phoneSignInInfo:{recaptchaToken:u,captchaResponse:a,clientType:"CLIENT_TYPE_WEB",recaptchaVersion:"RECAPTCHA_ENTERPRISE"}})}return c}return r?Object.assign(c,{captchaResp:a}):Object.assign(c,{captchaResponse:a}),Object.assign(c,{clientType:"CLIENT_TYPE_WEB"}),Object.assign(c,{recaptchaVersion:"RECAPTCHA_ENTERPRISE"}),c}async function Yr(n,e,t,r,i){var s,a;if(i==="EMAIL_PASSWORD_PROVIDER")if(!((s=n._getRecaptchaConfig())===null||s===void 0)&&s.isProviderEnabled("EMAIL_PASSWORD_PROVIDER")){let c=await Kr(n,e,t,t==="getOobCode");return r(n,c)}else return r(n,e).catch(async c=>{if(c.code==="auth/missing-recaptcha-token"){console.log(`${t} is protected by reCAPTCHA Enterprise for this project. Automatically triggering the reCAPTCHA flow and restarting the flow.`);let u=await Kr(n,e,t,t==="getOobCode");return r(n,u)}else return Promise.reject(c)});else if(i==="PHONE_PROVIDER")if(!((a=n._getRecaptchaConfig())===null||a===void 0)&&a.isProviderEnabled("PHONE_PROVIDER")){let c=await Kr(n,e,t);return r(n,c).catch(async u=>{var d;if(((d=n._getRecaptchaConfig())===null||d===void 0?void 0:d.getProviderEnforcementState("PHONE_PROVIDER"))==="AUDIT"&&(u.code==="auth/missing-recaptcha-token"||u.code==="auth/invalid-app-credential")){console.log(`Failed to verify with reCAPTCHA Enterprise. Automatically triggering the reCAPTCHA v2 flow to complete the ${t} flow.`);let f=await Kr(n,e,t,!1,!0);return r(n,f)}return Promise.reject(u)})}else{let c=await Kr(n,e,t,!1,!0);return r(n,c)}else return Promise.reject(i+" provider is not supported.")}async function hI(n){let e=qn(n),t=await Wf(e,{clientType:"CLIENT_TYPE_WEB",version:"RECAPTCHA_ENTERPRISE"}),r=new Ss(t);e.tenantId==null?e._agentRecaptchaConfig=r:e._tenantRecaptchaConfigs[e.tenantId]=r,r.isAnyProviderEnabled()&&new Ds(e).verify()}function Qs(n,e){let t=pe(n,"auth");if(t.isInitialized()){let i=t.getImmediate(),s=t.getOptions();if(Xe(s,e??{}))return i;We(i,"already-initialized")}return t.initialize({options:e})}function dI(n,e){let t=e?.persistence||[],r=(Array.isArray(t)?t:[t]).map(vt);e?.errorMap&&n._updateErrorMap(e.errorMap),n._initializeWithPersistence(r,e?.popupRedirectResolver)}function lp(n,e,t){let r=qn(n);x(r._canInitEmulator,r,"emulator-config-failed"),x(/^https?:\/\//.test(e),r,"invalid-emulator-scheme");let i=!!t?.disableWarnings,s=hp(e),{host:a,port:c}=fI(e),u=c===null?"":`:${c}`;r.config.emulator={url:`${s}//${a}${u}/`},r.settings.appVerificationDisabledForTesting=!0,r.emulatorConfig=Object.freeze({host:a,port:c,protocol:s.replace(":",""),options:Object.freeze({disableWarnings:i})}),i||pI()}function hp(n){let e=n.indexOf(":");return e<0?"":n.substr(0,e+1)}function fI(n){let e=hp(n),t=/(\/\/)?([^?#/]+)/.exec(n.substr(e.length));if(!t)return{host:"",port:null};let r=t[2].split("@").pop()||"",i=/^(\[[^\]]+\])(:|$)/.exec(r);if(i){let s=i[1];return{host:s,port:kf(r.substr(s.length+1))}}else{let[s,a]=r.split(":");return{host:s,port:kf(a)}}}function kf(n){if(!n)return null;let e=Number(n);return isNaN(e)?null:e}function pI(){function n(){let e=document.createElement("p"),t=e.style;e.innerText="Running in emulator mode. Do not use with production credentials.",t.position="fixed",t.width="100%",t.backgroundColor="#ffffff",t.border=".1em solid #000000",t.color="#b50000",t.bottom="0px",t.left="0px",t.margin="0px",t.zIndex="10000",t.textAlign="center",e.classList.add("firebase-emulator-warning"),document.body.appendChild(e)}typeof console<"u"&&typeof console.info=="function"&&console.info("WARNING: You are using the Auth Emulator, which is intended for local testing only.  Do not use with production credentials."),typeof window<"u"&&typeof document<"u"&&(document.readyState==="loading"?window.addEventListener("DOMContentLoaded",n):n())}var an=class{constructor(e,t){this.providerId=e,this.signInMethod=t}toJSON(){return nt("not implemented")}_getIdTokenResponse(e){return nt("not implemented")}_linkToIdToken(e,t){return nt("not implemented")}_getReauthenticationResolver(e){return nt("not implemented")}};async function mI(n,e){return be(n,"POST","/v1/accounts:signUp",e)}async function gI(n,e){return hn(n,"POST","/v1/accounts:signInWithPassword",me(n,e))}async function _I(n,e){return hn(n,"POST","/v1/accounts:signInWithEmailLink",me(n,e))}async function yI(n,e){return hn(n,"POST","/v1/accounts:signInWithEmailLink",me(n,e))}var Zr=class n extends an{constructor(e,t,r,i=null){super("password",r),this._email=e,this._password=t,this._tenantId=i}static _fromEmailAndPassword(e,t){return new n(e,t,"password")}static _fromEmailAndCode(e,t,r=null){return new n(e,t,"emailLink",r)}toJSON(){return{email:this._email,password:this._password,signInMethod:this.signInMethod,tenantId:this._tenantId}}static fromJSON(e){let t=typeof e=="string"?JSON.parse(e):e;if(t?.email&&t?.password){if(t.signInMethod==="password")return this._fromEmailAndPassword(t.email,t.password);if(t.signInMethod==="emailLink")return this._fromEmailAndCode(t.email,t.password,t.tenantId)}return null}async _getIdTokenResponse(e){switch(this.signInMethod){case"password":let t={returnSecureToken:!0,email:this._email,password:this._password,clientType:"CLIENT_TYPE_WEB"};return Yr(e,t,"signInWithPassword",gI,"EMAIL_PASSWORD_PROVIDER");case"emailLink":return _I(e,{email:this._email,oobCode:this._password});default:We(e,"internal-error")}}async _linkToIdToken(e,t){switch(this.signInMethod){case"password":let r={idToken:t,returnSecureToken:!0,email:this._email,password:this._password,clientType:"CLIENT_TYPE_WEB"};return Yr(e,r,"signUpPassword",mI,"EMAIL_PASSWORD_PROVIDER");case"emailLink":return yI(e,{idToken:t,email:this._email,oobCode:this._password});default:We(e,"internal-error")}}_getReauthenticationResolver(e){return this._getIdTokenResponse(e)}};async function Fn(n,e){return hn(n,"POST","/v1/accounts:signInWithIdp",me(n,e))}var wI="http://localhost",cn=class n extends an{constructor(){super(...arguments),this.pendingToken=null}static _fromParams(e){let t=new n(e.providerId,e.signInMethod);return e.idToken||e.accessToken?(e.idToken&&(t.idToken=e.idToken),e.accessToken&&(t.accessToken=e.accessToken),e.nonce&&!e.pendingToken&&(t.nonce=e.nonce),e.pendingToken&&(t.pendingToken=e.pendingToken)):e.oauthToken&&e.oauthTokenSecret?(t.accessToken=e.oauthToken,t.secret=e.oauthTokenSecret):We("argument-error"),t}toJSON(){return{idToken:this.idToken,accessToken:this.accessToken,secret:this.secret,nonce:this.nonce,pendingToken:this.pendingToken,providerId:this.providerId,signInMethod:this.signInMethod}}static fromJSON(e){let t=typeof e=="string"?JSON.parse(e):e,{providerId:r,signInMethod:i}=t,s=_s(t,["providerId","signInMethod"]);if(!r||!i)return null;let a=new n(r,i);return a.idToken=s.idToken||void 0,a.accessToken=s.accessToken||void 0,a.secret=s.secret,a.nonce=s.nonce,a.pendingToken=s.pendingToken||null,a}_getIdTokenResponse(e){let t=this.buildRequest();return Fn(e,t)}_linkToIdToken(e,t){let r=this.buildRequest();return r.idToken=t,Fn(e,r)}_getReauthenticationResolver(e){let t=this.buildRequest();return t.autoCreate=!1,Fn(e,t)}buildRequest(){let e={requestUri:wI,returnSecureToken:!0};if(this.pendingToken)e.pendingToken=this.pendingToken;else{let t={};this.idToken&&(t.id_token=this.idToken),this.accessToken&&(t.access_token=this.accessToken),this.secret&&(t.oauth_token_secret=this.secret),t.providerId=this.providerId,this.nonce&&!this.pendingToken&&(t.nonce=this.nonce),e.postBody=Vn(t)}return e}};async function Cf(n,e){return be(n,"POST","/v1/accounts:sendVerificationCode",me(n,e))}async function vI(n,e){return hn(n,"POST","/v1/accounts:signInWithPhoneNumber",me(n,e))}async function II(n,e){let t=await hn(n,"POST","/v1/accounts:signInWithPhoneNumber",me(n,e));if(t.temporaryProof)throw Gr(n,"account-exists-with-different-credential",t);return t}var TI={USER_NOT_FOUND:"user-not-found"};async function EI(n,e){let t=Object.assign(Object.assign({},e),{operation:"REAUTH"});return hn(n,"POST","/v1/accounts:signInWithPhoneNumber",me(n,t),TI)}var ei=class n extends an{constructor(e){super("phone","phone"),this.params=e}static _fromVerification(e,t){return new n({verificationId:e,verificationCode:t})}static _fromTokenResponse(e,t){return new n({phoneNumber:e,temporaryProof:t})}_getIdTokenResponse(e){return vI(e,this._makeVerificationRequest())}_linkToIdToken(e,t){return II(e,Object.assign({idToken:t},this._makeVerificationRequest()))}_getReauthenticationResolver(e){return EI(e,this._makeVerificationRequest())}_makeVerificationRequest(){let{temporaryProof:e,phoneNumber:t,verificationId:r,verificationCode:i}=this.params;return e&&t?{temporaryProof:e,phoneNumber:t}:{sessionInfo:r,code:i}}toJSON(){let e={providerId:this.providerId};return this.params.phoneNumber&&(e.phoneNumber=this.params.phoneNumber),this.params.temporaryProof&&(e.temporaryProof=this.params.temporaryProof),this.params.verificationCode&&(e.verificationCode=this.params.verificationCode),this.params.verificationId&&(e.verificationId=this.params.verificationId),e}static fromJSON(e){typeof e=="string"&&(e=JSON.parse(e));let{verificationId:t,verificationCode:r,phoneNumber:i,temporaryProof:s}=e;return!r&&!t&&!i&&!s?null:new n({verificationId:t,verificationCode:r,phoneNumber:i,temporaryProof:s})}};function bI(n){switch(n){case"recoverEmail":return"RECOVER_EMAIL";case"resetPassword":return"PASSWORD_RESET";case"signIn":return"EMAIL_SIGNIN";case"verifyEmail":return"VERIFY_EMAIL";case"verifyAndChangeEmail":return"VERIFY_AND_CHANGE_EMAIL";case"revertSecondFactorAddition":return"REVERT_SECOND_FACTOR_ADDITION";default:return null}}function AI(n){let e=Ln(Mn(n)).link,t=e?Ln(Mn(e)).deep_link_id:null,r=Ln(Mn(n)).deep_link_id;return(r?Ln(Mn(r)).link:null)||r||t||e||n}var Ns=class n{constructor(e){var t,r,i,s,a,c;let u=Ln(Mn(e)),d=(t=u.apiKey)!==null&&t!==void 0?t:null,f=(r=u.oobCode)!==null&&r!==void 0?r:null,g=bI((i=u.mode)!==null&&i!==void 0?i:null);x(d&&f&&g,"argument-error"),this.apiKey=d,this.operation=g,this.code=f,this.continueUrl=(s=u.continueUrl)!==null&&s!==void 0?s:null,this.languageCode=(a=u.languageCode)!==null&&a!==void 0?a:null,this.tenantId=(c=u.tenantId)!==null&&c!==void 0?c:null}static parseLink(e){let t=AI(e);try{return new n(t)}catch{return null}}};var Bn=class n{constructor(){this.providerId=n.PROVIDER_ID}static credential(e,t){return Zr._fromEmailAndPassword(e,t)}static credentialWithLink(e,t){let r=Ns.parseLink(t);return x(r,"argument-error"),Zr._fromEmailAndCode(e,r.code,r.tenantId)}};Bn.PROVIDER_ID="password";Bn.EMAIL_PASSWORD_SIGN_IN_METHOD="password";Bn.EMAIL_LINK_SIGN_IN_METHOD="emailLink";var Os=class{constructor(e){this.providerId=e,this.defaultLanguageCode=null,this.customParameters={}}setDefaultLanguage(e){this.defaultLanguageCode=e}setCustomParameters(e){return this.customParameters=e,this}getCustomParameters(){return this.customParameters}};var un=class extends Os{constructor(){super(...arguments),this.scopes=[]}addScope(e){return this.scopes.includes(e)||this.scopes.push(e),this}getScopes(){return[...this.scopes]}};var ti=class n extends un{constructor(){super("facebook.com")}static credential(e){return cn._fromParams({providerId:n.PROVIDER_ID,signInMethod:n.FACEBOOK_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return n.credentialFromTaggedObject(e)}static credentialFromError(e){return n.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return n.credential(e.oauthAccessToken)}catch{return null}}};ti.FACEBOOK_SIGN_IN_METHOD="facebook.com";ti.PROVIDER_ID="facebook.com";var ni=class n extends un{constructor(){super("google.com"),this.addScope("profile")}static credential(e,t){return cn._fromParams({providerId:n.PROVIDER_ID,signInMethod:n.GOOGLE_SIGN_IN_METHOD,idToken:e,accessToken:t})}static credentialFromResult(e){return n.credentialFromTaggedObject(e)}static credentialFromError(e){return n.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;let{oauthIdToken:t,oauthAccessToken:r}=e;if(!t&&!r)return null;try{return n.credential(t,r)}catch{return null}}};ni.GOOGLE_SIGN_IN_METHOD="google.com";ni.PROVIDER_ID="google.com";var ri=class n extends un{constructor(){super("github.com")}static credential(e){return cn._fromParams({providerId:n.PROVIDER_ID,signInMethod:n.GITHUB_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return n.credentialFromTaggedObject(e)}static credentialFromError(e){return n.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return n.credential(e.oauthAccessToken)}catch{return null}}};ri.GITHUB_SIGN_IN_METHOD="github.com";ri.PROVIDER_ID="github.com";var ii=class n extends un{constructor(){super("twitter.com")}static credential(e,t){return cn._fromParams({providerId:n.PROVIDER_ID,signInMethod:n.TWITTER_SIGN_IN_METHOD,oauthToken:e,oauthTokenSecret:t})}static credentialFromResult(e){return n.credentialFromTaggedObject(e)}static credentialFromError(e){return n.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;let{oauthAccessToken:t,oauthTokenSecret:r}=e;if(!t||!r)return null;try{return n.credential(t,r)}catch{return null}}};ii.TWITTER_SIGN_IN_METHOD="twitter.com";ii.PROVIDER_ID="twitter.com";var si=class n{constructor(e){this.user=e.user,this.providerId=e.providerId,this._tokenResponse=e._tokenResponse,this.operationType=e.operationType}static async _fromIdTokenResponse(e,t,r,i=!1){let s=await Un._fromIdTokenResponse(e,r,i),a=Df(r);return new n({user:s,providerId:a,_tokenResponse:r,operationType:t})}static async _forOperation(e,t,r){await e._updateTokensIfNecessary(r,!0);let i=Df(r);return new n({user:e,providerId:i,_tokenResponse:r,operationType:t})}};function Df(n){return n.providerId?n.providerId:"phoneNumber"in n?"phone":null}var Lc=class n extends he{constructor(e,t,r,i){var s;super(t.code,t.message),this.operationType=r,this.user=i,Object.setPrototypeOf(this,n.prototype),this.customData={appName:e.name,tenantId:(s=e.tenantId)!==null&&s!==void 0?s:void 0,_serverResponse:t.customData._serverResponse,operationType:r}}static _fromErrorAndOperation(e,t,r,i){return new n(e,t,r,i)}};function dp(n,e,t,r){return(e==="reauthenticate"?t._getReauthenticationResolver(n):t._getIdTokenResponse(n)).catch(s=>{throw s.code==="auth/multi-factor-auth-required"?Lc._fromErrorAndOperation(n,s,e,r):s})}async function SI(n,e,t=!1){let r=await Jr(n,e._linkToIdToken(n.auth,await n.getIdToken()),t);return si._forOperation(n,"link",r)}async function RI(n,e,t=!1){let{auth:r}=n;if(Ne(r.app))return Promise.reject(sn(r));let i="reauthenticate";try{let s=await Jr(n,dp(r,i,e,n),t);x(s.idToken,r,"internal-error");let a=Hc(s.idToken);x(a,r,"internal-error");let{sub:c}=a;return x(n.uid===c,r,"user-mismatch"),si._forOperation(n,i,s)}catch(s){throw s?.code==="auth/user-not-found"&&We(r,"user-mismatch"),s}}async function PI(n,e,t=!1){if(Ne(n.app))return Promise.reject(sn(n));let r="signIn",i=await dp(n,r,e),s=await si._fromIdTokenResponse(n,r,i);return t||await n._updateCurrentUser(s.user),s}function fp(n,e,t,r){return de(n).onIdTokenChanged(e,t,r)}function pp(n,e,t){return de(n).beforeAuthStateChanged(e,t)}function Nf(n,e){return be(n,"POST","/v2/accounts/mfaEnrollment:start",me(n,e))}function kI(n,e){return be(n,"POST","/v2/accounts/mfaEnrollment:finalize",me(n,e))}function CI(n,e){return be(n,"POST","/v2/accounts/mfaEnrollment:start",me(n,e))}function DI(n,e){return be(n,"POST","/v2/accounts/mfaEnrollment:finalize",me(n,e))}var xs="__sak";var Vs=class{constructor(e,t){this.storageRetriever=e,this.type=t}_isAvailable(){try{return this.storage?(this.storage.setItem(xs,"1"),this.storage.removeItem(xs),Promise.resolve(!0)):Promise.resolve(!1)}catch{return Promise.resolve(!1)}}_set(e,t){return this.storage.setItem(e,JSON.stringify(t)),Promise.resolve()}_get(e){let t=this.storage.getItem(e);return Promise.resolve(t?JSON.parse(t):null)}_remove(e){return this.storage.removeItem(e),Promise.resolve()}get storage(){return this.storageRetriever()}};var NI=1e3,OI=10,Ls=class extends Vs{constructor(){super(()=>window.localStorage,"LOCAL"),this.boundEventHandler=(e,t)=>this.onStorageEvent(e,t),this.listeners={},this.localCache={},this.pollTimer=null,this.fallbackToPolling=op(),this._shouldAllowMigration=!0}forAllChangedKeys(e){for(let t of Object.keys(this.listeners)){let r=this.storage.getItem(t),i=this.localCache[t];r!==i&&e(t,i,r)}}onStorageEvent(e,t=!1){if(!e.key){this.forAllChangedKeys((a,c,u)=>{this.notifyListeners(a,u)});return}let r=e.key;t?this.detachListener():this.stopPolling();let i=()=>{let a=this.storage.getItem(r);!t&&this.localCache[r]===a||this.notifyListeners(r,a)},s=this.storage.getItem(r);iI()&&s!==e.newValue&&e.newValue!==e.oldValue?setTimeout(i,OI):i()}notifyListeners(e,t){this.localCache[e]=t;let r=this.listeners[e];if(r)for(let i of Array.from(r))i(t&&JSON.parse(t))}startPolling(){this.stopPolling(),this.pollTimer=setInterval(()=>{this.forAllChangedKeys((e,t,r)=>{this.onStorageEvent(new StorageEvent("storage",{key:e,oldValue:t,newValue:r}),!0)})},NI)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}attachListener(){window.addEventListener("storage",this.boundEventHandler)}detachListener(){window.removeEventListener("storage",this.boundEventHandler)}_addListener(e,t){Object.keys(this.listeners).length===0&&(this.fallbackToPolling?this.startPolling():this.attachListener()),this.listeners[e]||(this.listeners[e]=new Set,this.localCache[e]=this.storage.getItem(e)),this.listeners[e].add(t)}_removeListener(e,t){this.listeners[e]&&(this.listeners[e].delete(t),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&(this.detachListener(),this.stopPolling())}async _set(e,t){await super._set(e,t),this.localCache[e]=JSON.stringify(t)}async _get(e){let t=await super._get(e);return this.localCache[e]=JSON.stringify(t),t}async _remove(e){await super._remove(e),delete this.localCache[e]}};Ls.type="LOCAL";var Ys=Ls;var Ms=class extends Vs{constructor(){super(()=>window.sessionStorage,"SESSION")}_addListener(e,t){}_removeListener(e,t){}};Ms.type="SESSION";var Qc=Ms;function xI(n){return Promise.all(n.map(async e=>{try{return{fulfilled:!0,value:await e}}catch(t){return{fulfilled:!1,reason:t}}}))}var Fs=class n{constructor(e){this.eventTarget=e,this.handlersMap={},this.boundEventHandler=this.handleEvent.bind(this)}static _getInstance(e){let t=this.receivers.find(i=>i.isListeningto(e));if(t)return t;let r=new n(e);return this.receivers.push(r),r}isListeningto(e){return this.eventTarget===e}async handleEvent(e){let t=e,{eventId:r,eventType:i,data:s}=t.data,a=this.handlersMap[i];if(!a?.size)return;t.ports[0].postMessage({status:"ack",eventId:r,eventType:i});let c=Array.from(a).map(async d=>d(t.origin,s)),u=await xI(c);t.ports[0].postMessage({status:"done",eventId:r,eventType:i,response:u})}_subscribe(e,t){Object.keys(this.handlersMap).length===0&&this.eventTarget.addEventListener("message",this.boundEventHandler),this.handlersMap[e]||(this.handlersMap[e]=new Set),this.handlersMap[e].add(t)}_unsubscribe(e,t){this.handlersMap[e]&&t&&this.handlersMap[e].delete(t),(!t||this.handlersMap[e].size===0)&&delete this.handlersMap[e],Object.keys(this.handlersMap).length===0&&this.eventTarget.removeEventListener("message",this.boundEventHandler)}};Fs.receivers=[];function Yc(n="",e=10){let t="";for(let r=0;r<e;r++)t+=Math.floor(Math.random()*10);return n+t}var Mc=class{constructor(e){this.target=e,this.handlers=new Set}removeMessageHandler(e){e.messageChannel&&(e.messageChannel.port1.removeEventListener("message",e.onMessage),e.messageChannel.port1.close()),this.handlers.delete(e)}async _send(e,t,r=50){let i=typeof MessageChannel<"u"?new MessageChannel:null;if(!i)throw new Error("connection_unavailable");let s,a;return new Promise((c,u)=>{let d=Yc("",20);i.port1.start();let f=setTimeout(()=>{u(new Error("unsupported_event"))},r);a={messageChannel:i,onMessage(g){let b=g;if(b.data.eventId===d)switch(b.data.status){case"ack":clearTimeout(f),s=setTimeout(()=>{u(new Error("timeout"))},3e3);break;case"done":clearTimeout(s),c(b.data.response);break;default:clearTimeout(f),clearTimeout(s),u(new Error("invalid_response"));break}}},this.handlers.add(a),i.port1.addEventListener("message",a.onMessage),this.target.postMessage({eventType:e,eventId:d,data:t},[i.port2])}).finally(()=>{a&&this.removeMessageHandler(a)})}};function it(){return window}function VI(n){it().location.href=n}function mp(){return typeof it().WorkerGlobalScope<"u"&&typeof it().importScripts=="function"}async function LI(){if(!navigator?.serviceWorker)return null;try{return(await navigator.serviceWorker.ready).active}catch{return null}}function MI(){var n;return((n=navigator?.serviceWorker)===null||n===void 0?void 0:n.controller)||null}function FI(){return mp()?self:null}var gp="firebaseLocalStorageDb",UI=1,Us="firebaseLocalStorage",_p="fbase_key",ln=class{constructor(e){this.request=e}toPromise(){return new Promise((e,t)=>{this.request.addEventListener("success",()=>{e(this.request.result)}),this.request.addEventListener("error",()=>{t(this.request.error)})})}};function Js(n,e){return n.transaction([Us],e?"readwrite":"readonly").objectStore(Us)}function BI(){let n=indexedDB.deleteDatabase(gp);return new ln(n).toPromise()}function Fc(){let n=indexedDB.open(gp,UI);return new Promise((e,t)=>{n.addEventListener("error",()=>{t(n.error)}),n.addEventListener("upgradeneeded",()=>{let r=n.result;try{r.createObjectStore(Us,{keyPath:_p})}catch(i){t(i)}}),n.addEventListener("success",async()=>{let r=n.result;r.objectStoreNames.contains(Us)?e(r):(r.close(),await BI(),e(await Fc()))})})}async function Of(n,e,t){let r=Js(n,!0).put({[_p]:e,value:t});return new ln(r).toPromise()}async function qI(n,e){let t=Js(n,!1).get(e),r=await new ln(t).toPromise();return r===void 0?null:r.value}function xf(n,e){let t=Js(n,!0).delete(e);return new ln(t).toPromise()}var jI=800,zI=3,Bs=class{constructor(){this.type="LOCAL",this._shouldAllowMigration=!0,this.listeners={},this.localCache={},this.pollTimer=null,this.pendingWrites=0,this.receiver=null,this.sender=null,this.serviceWorkerReceiverAvailable=!1,this.activeServiceWorker=null,this._workerInitializationPromise=this.initializeServiceWorkerMessaging().then(()=>{},()=>{})}async _openDb(){return this.db?this.db:(this.db=await Fc(),this.db)}async _withRetries(e){let t=0;for(;;)try{let r=await this._openDb();return await e(r)}catch(r){if(t++>zI)throw r;this.db&&(this.db.close(),this.db=void 0)}}async initializeServiceWorkerMessaging(){return mp()?this.initializeReceiver():this.initializeSender()}async initializeReceiver(){this.receiver=Fs._getInstance(FI()),this.receiver._subscribe("keyChanged",async(e,t)=>({keyProcessed:(await this._poll()).includes(t.key)})),this.receiver._subscribe("ping",async(e,t)=>["keyChanged"])}async initializeSender(){var e,t;if(this.activeServiceWorker=await LI(),!this.activeServiceWorker)return;this.sender=new Mc(this.activeServiceWorker);let r=await this.sender._send("ping",{},800);r&&!((e=r[0])===null||e===void 0)&&e.fulfilled&&!((t=r[0])===null||t===void 0)&&t.value.includes("keyChanged")&&(this.serviceWorkerReceiverAvailable=!0)}async notifyServiceWorker(e){if(!(!this.sender||!this.activeServiceWorker||MI()!==this.activeServiceWorker))try{await this.sender._send("keyChanged",{key:e},this.serviceWorkerReceiverAvailable?800:50)}catch{}}async _isAvailable(){try{if(!indexedDB)return!1;let e=await Fc();return await Of(e,xs,"1"),await xf(e,xs),!0}catch{}return!1}async _withPendingWrite(e){this.pendingWrites++;try{await e()}finally{this.pendingWrites--}}async _set(e,t){return this._withPendingWrite(async()=>(await this._withRetries(r=>Of(r,e,t)),this.localCache[e]=t,this.notifyServiceWorker(e)))}async _get(e){let t=await this._withRetries(r=>qI(r,e));return this.localCache[e]=t,t}async _remove(e){return this._withPendingWrite(async()=>(await this._withRetries(t=>xf(t,e)),delete this.localCache[e],this.notifyServiceWorker(e)))}async _poll(){let e=await this._withRetries(i=>{let s=Js(i,!1).getAll();return new ln(s).toPromise()});if(!e)return[];if(this.pendingWrites!==0)return[];let t=[],r=new Set;if(e.length!==0)for(let{fbase_key:i,value:s}of e)r.add(i),JSON.stringify(this.localCache[i])!==JSON.stringify(s)&&(this.notifyListeners(i,s),t.push(i));for(let i of Object.keys(this.localCache))this.localCache[i]&&!r.has(i)&&(this.notifyListeners(i,null),t.push(i));return t}notifyListeners(e,t){this.localCache[e]=t;let r=this.listeners[e];if(r)for(let i of Array.from(r))i(t)}startPolling(){this.stopPolling(),this.pollTimer=setInterval(async()=>this._poll(),jI)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}_addListener(e,t){Object.keys(this.listeners).length===0&&this.startPolling(),this.listeners[e]||(this.listeners[e]=new Set,this._get(e)),this.listeners[e].add(t)}_removeListener(e,t){this.listeners[e]&&(this.listeners[e].delete(t),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&this.stopPolling()}};Bs.type="LOCAL";var Xs=Bs;function Vf(n,e){return be(n,"POST","/v2/accounts/mfaSignIn:start",me(n,e))}function $I(n,e){return be(n,"POST","/v2/accounts/mfaSignIn:finalize",me(n,e))}function KI(n,e){return be(n,"POST","/v2/accounts/mfaSignIn:finalize",me(n,e))}var l0=up("rcb"),h0=new on(3e4,6e4);var Is="recaptcha";async function GI(n,e,t){var r;if(!n._getRecaptchaConfig())try{await hI(n)}catch{console.log("Failed to initialize reCAPTCHA Enterprise config. Triggering the reCAPTCHA v2 verification.")}try{let i;if(typeof e=="string"?i={phoneNumber:e}:i=e,"session"in i){let s=i.session;if("phoneNumber"in i){x(s.type==="enroll",n,"internal-error");let a={idToken:s.credential,phoneEnrollmentInfo:{phoneNumber:i.phoneNumber,clientType:"CLIENT_TYPE_WEB"}};return(await Yr(n,a,"mfaSmsEnrollment",async(f,g)=>{if(g.phoneEnrollmentInfo.captchaResponse===Qr){x(t?.type===Is,f,"argument-error");let b=await Ac(f,g,t);return Nf(f,b)}return Nf(f,g)},"PHONE_PROVIDER").catch(f=>Promise.reject(f))).phoneSessionInfo.sessionInfo}else{x(s.type==="signin",n,"internal-error");let a=((r=i.multiFactorHint)===null||r===void 0?void 0:r.uid)||i.multiFactorUid;x(a,n,"missing-multi-factor-info");let c={mfaPendingCredential:s.credential,mfaEnrollmentId:a,phoneSignInInfo:{clientType:"CLIENT_TYPE_WEB"}};return(await Yr(n,c,"mfaSmsSignIn",async(g,b)=>{if(b.phoneSignInInfo.captchaResponse===Qr){x(t?.type===Is,g,"argument-error");let R=await Ac(g,b,t);return Vf(g,R)}return Vf(g,b)},"PHONE_PROVIDER").catch(g=>Promise.reject(g))).phoneResponseInfo.sessionInfo}}else{let s={phoneNumber:i.phoneNumber,clientType:"CLIENT_TYPE_WEB"};return(await Yr(n,s,"sendVerificationCode",async(d,f)=>{if(f.captchaResponse===Qr){x(t?.type===Is,d,"argument-error");let g=await Ac(d,f,t);return Cf(d,g)}return Cf(d,f)},"PHONE_PROVIDER").catch(d=>Promise.reject(d))).sessionInfo}}finally{t?._reset()}}async function Ac(n,e,t){x(t.type===Is,n,"argument-error");let r=await t.verify();x(typeof r=="string",n,"argument-error");let i=Object.assign({},e);if("phoneEnrollmentInfo"in i){let s=i.phoneEnrollmentInfo.phoneNumber,a=i.phoneEnrollmentInfo.captchaResponse,c=i.phoneEnrollmentInfo.clientType,u=i.phoneEnrollmentInfo.recaptchaVersion;return Object.assign(i,{phoneEnrollmentInfo:{phoneNumber:s,recaptchaToken:r,captchaResponse:a,clientType:c,recaptchaVersion:u}}),i}else if("phoneSignInInfo"in i){let s=i.phoneSignInInfo.captchaResponse,a=i.phoneSignInInfo.clientType,c=i.phoneSignInInfo.recaptchaVersion;return Object.assign(i,{phoneSignInInfo:{recaptchaToken:r,captchaResponse:s,clientType:a,recaptchaVersion:c}}),i}else return Object.assign(i,{recaptchaToken:r}),i}var oi=class n{constructor(e){this.providerId=n.PROVIDER_ID,this.auth=qn(e)}verifyPhoneNumber(e,t){return GI(this.auth,e,de(t))}static credential(e,t){return ei._fromVerification(e,t)}static credentialFromResult(e){let t=e;return n.credentialFromTaggedObject(t)}static credentialFromError(e){return n.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;let{phoneNumber:t,temporaryProof:r}=e;return t&&r?ei._fromTokenResponse(t,r):null}};oi.PROVIDER_ID="phone";oi.PHONE_SIGN_IN_METHOD="phone";function HI(n,e){return e?vt(e):(x(n._popupRedirectResolver,n,"argument-error"),n._popupRedirectResolver)}var ai=class extends an{constructor(e){super("custom","custom"),this.params=e}_getIdTokenResponse(e){return Fn(e,this._buildIdpRequest())}_linkToIdToken(e,t){return Fn(e,this._buildIdpRequest(t))}_getReauthenticationResolver(e){return Fn(e,this._buildIdpRequest())}_buildIdpRequest(e){let t={requestUri:this.params.requestUri,sessionId:this.params.sessionId,postBody:this.params.postBody,tenantId:this.params.tenantId,pendingToken:this.params.pendingToken,returnSecureToken:!0,returnIdpCredential:!0};return e&&(t.idToken=e),t}};function WI(n){return PI(n.auth,new ai(n),n.bypassAuthState)}function QI(n){let{auth:e,user:t}=n;return x(t,e,"internal-error"),RI(t,new ai(n),n.bypassAuthState)}async function YI(n){let{auth:e,user:t}=n;return x(t,e,"internal-error"),SI(t,new ai(n),n.bypassAuthState)}var qs=class{constructor(e,t,r,i,s=!1){this.auth=e,this.resolver=r,this.user=i,this.bypassAuthState=s,this.pendingPromise=null,this.eventManager=null,this.filter=Array.isArray(t)?t:[t]}execute(){return new Promise(async(e,t)=>{this.pendingPromise={resolve:e,reject:t};try{this.eventManager=await this.resolver._initialize(this.auth),await this.onExecution(),this.eventManager.registerConsumer(this)}catch(r){this.reject(r)}})}async onAuthEvent(e){let{urlResponse:t,sessionId:r,postBody:i,tenantId:s,error:a,type:c}=e;if(a){this.reject(a);return}let u={auth:this.auth,requestUri:t,sessionId:r,tenantId:s||void 0,postBody:i||void 0,user:this.user,bypassAuthState:this.bypassAuthState};try{this.resolve(await this.getIdpTask(c)(u))}catch(d){this.reject(d)}}onError(e){this.reject(e)}getIdpTask(e){switch(e){case"signInViaPopup":case"signInViaRedirect":return WI;case"linkViaPopup":case"linkViaRedirect":return YI;case"reauthViaPopup":case"reauthViaRedirect":return QI;default:We(this.auth,"internal-error")}}resolve(e){It(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.resolve(e),this.unregisterAndCleanUp()}reject(e){It(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.reject(e),this.unregisterAndCleanUp()}unregisterAndCleanUp(){this.eventManager&&this.eventManager.unregisterConsumer(this),this.pendingPromise=null,this.cleanUp()}};var JI=new on(2e3,1e4);var Uc=class n extends qs{constructor(e,t,r,i,s){super(e,t,i,s),this.provider=r,this.authWindow=null,this.pollId=null,n.currentPopupAction&&n.currentPopupAction.cancel(),n.currentPopupAction=this}async executeNotNull(){let e=await this.execute();return x(e,this.auth,"internal-error"),e}async onExecution(){It(this.filter.length===1,"Popup operations only handle one event");let e=Yc();this.authWindow=await this.resolver._openPopup(this.auth,this.provider,this.filter[0],e),this.authWindow.associatedEvent=e,this.resolver._originValidation(this.auth).catch(t=>{this.reject(t)}),this.resolver._isIframeWebStorageSupported(this.auth,t=>{t||this.reject(rt(this.auth,"web-storage-unsupported"))}),this.pollUserCancellation()}get eventId(){var e;return((e=this.authWindow)===null||e===void 0?void 0:e.associatedEvent)||null}cancel(){this.reject(rt(this.auth,"cancelled-popup-request"))}cleanUp(){this.authWindow&&this.authWindow.close(),this.pollId&&window.clearTimeout(this.pollId),this.authWindow=null,this.pollId=null,n.currentPopupAction=null}pollUserCancellation(){let e=()=>{var t,r;if(!((r=(t=this.authWindow)===null||t===void 0?void 0:t.window)===null||r===void 0)&&r.closed){this.pollId=window.setTimeout(()=>{this.pollId=null,this.reject(rt(this.auth,"popup-closed-by-user"))},8e3);return}this.pollId=window.setTimeout(e,JI.get())};e()}};Uc.currentPopupAction=null;var XI="pendingRedirect",Ts=new Map,Bc=class extends qs{constructor(e,t,r=!1){super(e,["signInViaRedirect","linkViaRedirect","reauthViaRedirect","unknown"],t,void 0,r),this.eventId=null}async execute(){let e=Ts.get(this.auth._key());if(!e){try{let r=await ZI(this.resolver,this.auth)?await super.execute():null;e=()=>Promise.resolve(r)}catch(t){e=()=>Promise.reject(t)}Ts.set(this.auth._key(),e)}return this.bypassAuthState||Ts.set(this.auth._key(),()=>Promise.resolve(null)),e()}async onAuthEvent(e){if(e.type==="signInViaRedirect")return super.onAuthEvent(e);if(e.type==="unknown"){this.resolve(null);return}if(e.eventId){let t=await this.auth._redirectUserForId(e.eventId);if(t)return this.user=t,super.onAuthEvent(e);this.resolve(null)}}async onExecution(){}cleanUp(){}};async function ZI(n,e){let t=nT(e),r=tT(n);if(!await r._isAvailable())return!1;let i=await r._get(t)==="true";return await r._remove(t),i}function eT(n,e){Ts.set(n._key(),e)}function tT(n){return vt(n._redirectPersistence)}function nT(n){return vs(XI,n.config.apiKey,n.name)}async function rT(n,e,t=!1){if(Ne(n.app))return Promise.reject(sn(n));let r=qn(n),i=HI(r,e),a=await new Bc(r,i,t).execute();return a&&!t&&(delete a.user._redirectEventId,await r._persistUserIfCurrent(a.user),await r._setRedirectUser(null,e)),a}var iT=10*60*1e3,qc=class{constructor(e){this.auth=e,this.cachedEventUids=new Set,this.consumers=new Set,this.queuedRedirectEvent=null,this.hasHandledPotentialRedirect=!1,this.lastProcessedEventTime=Date.now()}registerConsumer(e){this.consumers.add(e),this.queuedRedirectEvent&&this.isEventForConsumer(this.queuedRedirectEvent,e)&&(this.sendToConsumer(this.queuedRedirectEvent,e),this.saveEventToCache(this.queuedRedirectEvent),this.queuedRedirectEvent=null)}unregisterConsumer(e){this.consumers.delete(e)}onEvent(e){if(this.hasEventBeenHandled(e))return!1;let t=!1;return this.consumers.forEach(r=>{this.isEventForConsumer(e,r)&&(t=!0,this.sendToConsumer(e,r),this.saveEventToCache(e))}),this.hasHandledPotentialRedirect||!sT(e)||(this.hasHandledPotentialRedirect=!0,t||(this.queuedRedirectEvent=e,t=!0)),t}sendToConsumer(e,t){var r;if(e.error&&!yp(e)){let i=((r=e.error.code)===null||r===void 0?void 0:r.split("auth/")[1])||"internal-error";t.onError(rt(this.auth,i))}else t.onAuthEvent(e)}isEventForConsumer(e,t){let r=t.eventId===null||!!e.eventId&&e.eventId===t.eventId;return t.filter.includes(e.type)&&r}hasEventBeenHandled(e){return Date.now()-this.lastProcessedEventTime>=iT&&this.cachedEventUids.clear(),this.cachedEventUids.has(Lf(e))}saveEventToCache(e){this.cachedEventUids.add(Lf(e)),this.lastProcessedEventTime=Date.now()}};function Lf(n){return[n.type,n.eventId,n.sessionId,n.tenantId].filter(e=>e).join("-")}function yp({type:n,error:e}){return n==="unknown"&&e?.code==="auth/no-auth-event"}function sT(n){switch(n.type){case"signInViaRedirect":case"linkViaRedirect":case"reauthViaRedirect":return!0;case"unknown":return yp(n);default:return!1}}async function oT(n,e={}){return be(n,"GET","/v1/projects",e)}var aT=/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,cT=/^https?/;async function uT(n){if(n.config.emulator)return;let{authorizedDomains:e}=await oT(n);for(let t of e)try{if(lT(t))return}catch{}We(n,"unauthorized-domain")}function lT(n){let e=Rc(),{protocol:t,hostname:r}=new URL(e);if(n.startsWith("chrome-extension://")){let a=new URL(n);return a.hostname===""&&r===""?t==="chrome-extension:"&&n.replace("chrome-extension://","")===e.replace("chrome-extension://",""):t==="chrome-extension:"&&a.hostname===r}if(!cT.test(t))return!1;if(aT.test(n))return r===n;let i=n.replace(/\./g,"\\.");return new RegExp("^(.+\\."+i+"|"+i+")$","i").test(r)}var hT=new on(3e4,6e4);function Mf(){let n=it().___jsl;if(n?.H){for(let e of Object.keys(n.H))if(n.H[e].r=n.H[e].r||[],n.H[e].L=n.H[e].L||[],n.H[e].r=[...n.H[e].L],n.CP)for(let t=0;t<n.CP.length;t++)n.CP[t]=null}}function dT(n){return new Promise((e,t)=>{var r,i,s;function a(){Mf(),gapi.load("gapi.iframes",{callback:()=>{e(gapi.iframes.getContext())},ontimeout:()=>{Mf(),t(rt(n,"network-request-failed"))},timeout:hT.get()})}if(!((i=(r=it().gapi)===null||r===void 0?void 0:r.iframes)===null||i===void 0)&&i.Iframe)e(gapi.iframes.getContext());else if(!((s=it().gapi)===null||s===void 0)&&s.load)a();else{let c=up("iframefcb");return it()[c]=()=>{gapi.load?a():t(rt(n,"network-request-failed"))},cp(`${uI()}?onload=${c}`).catch(u=>t(u))}}).catch(e=>{throw Es=null,e})}var Es=null;function fT(n){return Es=Es||dT(n),Es}var pT=new on(5e3,15e3),mT="__/auth/iframe",gT="emulator/auth/iframe",_T={style:{position:"absolute",top:"-100px",width:"1px",height:"1px"},"aria-hidden":"true",tabindex:"-1"},yT=new Map([["identitytoolkit.googleapis.com","p"],["staging-identitytoolkit.sandbox.googleapis.com","s"],["test-identitytoolkit.sandbox.googleapis.com","t"]]);function wT(n){let e=n.config;x(e.authDomain,n,"auth-domain-config-required");let t=e.emulator?Gc(e,gT):`https://${n.config.authDomain}/${mT}`,r={apiKey:e.apiKey,appName:n.name,v:tt},i=yT.get(n.config.apiHost);i&&(r.eid=i);let s=n._getFrameworks();return s.length&&(r.fw=s.join(",")),`${t}?${Vn(r).slice(1)}`}async function vT(n){let e=await fT(n),t=it().gapi;return x(t,n,"internal-error"),e.open({where:document.body,url:wT(n),messageHandlersFilter:t.iframes.CROSS_ORIGIN_IFRAMES_FILTER,attributes:_T,dontclear:!0},r=>new Promise(async(i,s)=>{await r.restyle({setHideOnLeave:!1});let a=rt(n,"network-request-failed"),c=it().setTimeout(()=>{s(a)},pT.get());function u(){it().clearTimeout(c),i(r)}r.ping(u).then(u,()=>{s(a)})}))}var IT={location:"yes",resizable:"yes",statusbar:"yes",toolbar:"no"},TT=500,ET=600,bT="_blank",AT="http://localhost",js=class{constructor(e){this.window=e,this.associatedEvent=null}close(){if(this.window)try{this.window.close()}catch{}}};function ST(n,e,t,r=TT,i=ET){let s=Math.max((window.screen.availHeight-i)/2,0).toString(),a=Math.max((window.screen.availWidth-r)/2,0).toString(),c="",u=Object.assign(Object.assign({},IT),{width:r.toString(),height:i.toString(),top:s,left:a}),d=se().toLowerCase();t&&(c=tp(d)?bT:t),Zf(d)&&(e=e||AT,u.scrollbars="yes");let f=Object.entries(u).reduce((b,[R,k])=>`${b}${R}=${k},`,"");if(rI(d)&&c!=="_self")return RT(e||"",c),new js(null);let g=window.open(e||"",c,f);x(g,n,"popup-blocked");try{g.focus()}catch{}return new js(g)}function RT(n,e){let t=document.createElement("a");t.href=n,t.target=e;let r=document.createEvent("MouseEvent");r.initMouseEvent("click",!0,!0,window,1,0,0,0,0,!1,!1,!1,!1,1,null),t.dispatchEvent(r)}var PT="__/auth/handler",kT="emulator/auth/handler",CT=encodeURIComponent("fac");async function Ff(n,e,t,r,i,s){x(n.config.authDomain,n,"auth-domain-config-required"),x(n.config.apiKey,n,"invalid-api-key");let a={apiKey:n.config.apiKey,appName:n.name,authType:t,redirectUrl:r,v:tt,eventId:i};if(e instanceof Os){e.setDefaultLanguage(n.languageCode),a.providerId=e.providerId||"",Nd(e.getCustomParameters())||(a.customParameters=JSON.stringify(e.getCustomParameters()));for(let[f,g]of Object.entries(s||{}))a[f]=g}if(e instanceof un){let f=e.getScopes().filter(g=>g!=="");f.length>0&&(a.scopes=f.join(","))}n.tenantId&&(a.tid=n.tenantId);let c=a;for(let f of Object.keys(c))c[f]===void 0&&delete c[f];let u=await n._getAppCheckToken(),d=u?`#${CT}=${encodeURIComponent(u)}`:"";return`${DT(n)}?${Vn(c).slice(1)}${d}`}function DT({config:n}){return n.emulator?Gc(n,kT):`https://${n.authDomain}/${PT}`}var Sc="webStorageSupport",jc=class{constructor(){this.eventManagers={},this.iframes={},this.originValidationPromises={},this._redirectPersistence=Qc,this._completeRedirectFn=rT,this._overrideRedirectResult=eT}async _openPopup(e,t,r,i){var s;It((s=this.eventManagers[e._key()])===null||s===void 0?void 0:s.manager,"_initialize() not called before _openPopup()");let a=await Ff(e,t,r,Rc(),i);return ST(e,a,Yc())}async _openRedirect(e,t,r,i){await this._originValidation(e);let s=await Ff(e,t,r,Rc(),i);return VI(s),new Promise(()=>{})}_initialize(e){let t=e._key();if(this.eventManagers[t]){let{manager:i,promise:s}=this.eventManagers[t];return i?Promise.resolve(i):(It(s,"If manager is not set, promise should be"),s)}let r=this.initAndGetManager(e);return this.eventManagers[t]={promise:r},r.catch(()=>{delete this.eventManagers[t]}),r}async initAndGetManager(e){let t=await vT(e),r=new qc(e);return t.register("authEvent",i=>(x(i?.authEvent,e,"invalid-auth-event"),{status:r.onEvent(i.authEvent)?"ACK":"ERROR"}),gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER),this.eventManagers[e._key()]={manager:r},this.iframes[e._key()]=t,r}_isIframeWebStorageSupported(e,t){this.iframes[e._key()].send(Sc,{type:Sc},i=>{var s;let a=(s=i?.[0])===null||s===void 0?void 0:s[Sc];a!==void 0&&t(!!a),We(e,"internal-error")},gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER)}_originValidation(e){let t=e._key();return this.originValidationPromises[t]||(this.originValidationPromises[t]=uT(e)),this.originValidationPromises[t]}get _shouldInitProactively(){return op()||ep()||Wc()}},Zs=jc,zs=class{constructor(e){this.factorId=e}_process(e,t,r){switch(t.type){case"enroll":return this._finalizeEnroll(e,t.credential,r);case"signin":return this._finalizeSignIn(e,t.credential);default:return nt("unexpected MultiFactorSessionType")}}},zc=class n extends zs{constructor(e){super("phone"),this.credential=e}static _fromCredential(e){return new n(e)}_finalizeEnroll(e,t,r){return kI(e,{idToken:t,displayName:r,phoneVerificationInfo:this.credential._makeVerificationRequest()})}_finalizeSignIn(e,t){return $I(e,{mfaPendingCredential:t,phoneVerificationInfo:this.credential._makeVerificationRequest()})}},$s=class{constructor(){}static assertion(e){return zc._fromCredential(e)}};$s.FACTOR_ID="phone";var Ks=class{static assertionForEnrollment(e,t){return Gs._fromSecret(e,t)}static assertionForSignIn(e,t){return Gs._fromEnrollmentId(e,t)}static async generateSecret(e){var t;let r=e;x(typeof((t=r.user)===null||t===void 0?void 0:t.auth)<"u","internal-error");let i=await CI(r.user.auth,{idToken:r.credential,totpEnrollmentInfo:{}});return Hs._fromStartTotpMfaEnrollmentResponse(i,r.user.auth)}};Ks.FACTOR_ID="totp";var Gs=class n extends zs{constructor(e,t,r){super("totp"),this.otp=e,this.enrollmentId=t,this.secret=r}static _fromSecret(e,t){return new n(t,void 0,e)}static _fromEnrollmentId(e,t){return new n(t,e)}async _finalizeEnroll(e,t,r){return x(typeof this.secret<"u",e,"argument-error"),DI(e,{idToken:t,displayName:r,totpVerificationInfo:this.secret._makeTotpVerificationInfo(this.otp)})}async _finalizeSignIn(e,t){x(this.enrollmentId!==void 0&&this.otp!==void 0,e,"argument-error");let r={verificationCode:this.otp};return KI(e,{mfaPendingCredential:t,mfaEnrollmentId:this.enrollmentId,totpVerificationInfo:r})}},Hs=class n{constructor(e,t,r,i,s,a,c){this.sessionInfo=a,this.auth=c,this.secretKey=e,this.hashingAlgorithm=t,this.codeLength=r,this.codeIntervalSeconds=i,this.enrollmentCompletionDeadline=s}static _fromStartTotpMfaEnrollmentResponse(e,t){return new n(e.totpSessionInfo.sharedSecretKey,e.totpSessionInfo.hashingAlgorithm,e.totpSessionInfo.verificationCodeLength,e.totpSessionInfo.periodSec,new Date(e.totpSessionInfo.finalizeEnrollmentTime).toUTCString(),e.totpSessionInfo.sessionInfo,t)}_makeTotpVerificationInfo(e){return{sessionInfo:this.sessionInfo,verificationCode:e}}generateQrCodeUrl(e,t){var r;let i=!1;return(ys(e)||ys(t))&&(i=!0),i&&(ys(e)&&(e=((r=this.auth.currentUser)===null||r===void 0?void 0:r.email)||"unknownuser"),ys(t)&&(t=this.auth.name)),`otpauth://totp/${t}:${e}?secret=${this.secretKey}&issuer=${t}&algorithm=${this.hashingAlgorithm}&digits=${this.codeLength}`}};function ys(n){return typeof n>"u"||n?.length===0}var Uf="@firebase/auth",Bf="1.9.0";var $c=class{constructor(e){this.auth=e,this.internalListeners=new Map}getUid(){var e;return this.assertAuthConfigured(),((e=this.auth.currentUser)===null||e===void 0?void 0:e.uid)||null}async getToken(e){return this.assertAuthConfigured(),await this.auth._initializationPromise,this.auth.currentUser?{accessToken:await this.auth.currentUser.getIdToken(e)}:null}addAuthTokenListener(e){if(this.assertAuthConfigured(),this.internalListeners.has(e))return;let t=this.auth.onIdTokenChanged(r=>{e(r?.stsTokenManager.accessToken||null)});this.internalListeners.set(e,t),this.updateProactiveRefresh()}removeAuthTokenListener(e){this.assertAuthConfigured();let t=this.internalListeners.get(e);t&&(this.internalListeners.delete(e),t(),this.updateProactiveRefresh())}assertAuthConfigured(){x(this.auth._initializationPromise,"dependent-sdk-initialized-before-auth")}updateProactiveRefresh(){this.internalListeners.size>0?this.auth._startProactiveRefresh():this.auth._stopProactiveRefresh()}};function NT(n){switch(n){case"Node":return"node";case"ReactNative":return"rn";case"Worker":return"webworker";case"Cordova":return"cordova";case"WebExtension":return"web-extension";default:return}}function OT(n){oe(new te("auth",(e,{options:t})=>{let r=e.getProvider("app").getImmediate(),i=e.getProvider("heartbeat"),s=e.getProvider("app-check-internal"),{apiKey:a,authDomain:c}=r.options;x(a&&!a.includes(":"),"invalid-api-key",{appName:r.name});let u={apiKey:a,authDomain:c,clientPlatform:n,apiHost:"identitytoolkit.googleapis.com",tokenApiHost:"securetoken.googleapis.com",apiScheme:"https",sdkClientVersion:ap(n)},d=new Oc(r,i,s,u);return dI(d,t),d},"PUBLIC").setInstantiationMode("EXPLICIT").setInstanceCreatedCallback((e,t,r)=>{e.getProvider("auth-internal").initialize()})),oe(new te("auth-internal",e=>{let t=qn(e.getProvider("auth").getImmediate());return(r=>new $c(r))(t)},"PRIVATE").setInstantiationMode("EXPLICIT")),re(Uf,Bf,NT(n)),re(Uf,Bf,"esm2017")}var xT=5*60,VT=za("authIdTokenMaxAge")||xT,qf=null,LT=n=>async e=>{let t=e&&await e.getIdTokenResult(),r=t&&(new Date().getTime()-Date.parse(t.issuedAtTime))/1e3;if(r&&r>VT)return;let i=t?.token;qf!==i&&(qf=i,await fetch(n,{method:i?"POST":"DELETE",headers:i?{Authorization:`Bearer ${i}`}:{}}))};function Jc(n=Ve()){let e=pe(n,"auth");if(e.isInitialized())return e.getImmediate();let t=Qs(n,{popupRedirectResolver:Zs,persistence:[Xs,Ys,Qc]}),r=za("authTokenSyncURL");if(r&&typeof isSecureContext=="boolean"&&isSecureContext){let s=new URL(r,location.origin);if(location.origin===s.origin){let a=LT(s.toString());pp(t,a,()=>a(t.currentUser)),fp(t,c=>a(c))}}let i=qa("auth");return i&&lp(t,`http://${i}`),t}function MT(){var n,e;return(e=(n=document.getElementsByTagName("head"))===null||n===void 0?void 0:n[0])!==null&&e!==void 0?e:document}aI({loadJS(n){return new Promise((e,t)=>{let r=document.createElement("script");r.setAttribute("src",n),r.onload=e,r.onerror=i=>{let s=rt("internal-error");s.customData=i,t(s)},r.type="text/javascript",r.charset="UTF-8",MT().appendChild(r)})},gapiScript:"https://apis.google.com/js/api.js",recaptchaV2Script:"https://www.google.com/recaptcha/api.js",recaptchaEnterpriseScript:"https://www.google.com/recaptcha/enterprise.js?render="});OT("Browser");var wp=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{},vp={};var eo,Ip;(function(){var n;function e(w,m){function y(){}y.prototype=m.prototype,w.D=m.prototype,w.prototype=new y,w.prototype.constructor=w,w.C=function(v,I,E){for(var _=Array(arguments.length-2),pt=2;pt<arguments.length;pt++)_[pt-2]=arguments[pt];return m.prototype[I].apply(v,_)}}function t(){this.blockSize=-1}function r(){this.blockSize=-1,this.blockSize=64,this.g=Array(4),this.B=Array(this.blockSize),this.o=this.h=0,this.s()}e(r,t),r.prototype.s=function(){this.g[0]=1732584193,this.g[1]=4023233417,this.g[2]=2562383102,this.g[3]=271733878,this.o=this.h=0};function i(w,m,y){y||(y=0);var v=Array(16);if(typeof m=="string")for(var I=0;16>I;++I)v[I]=m.charCodeAt(y++)|m.charCodeAt(y++)<<8|m.charCodeAt(y++)<<16|m.charCodeAt(y++)<<24;else for(I=0;16>I;++I)v[I]=m[y++]|m[y++]<<8|m[y++]<<16|m[y++]<<24;m=w.g[0],y=w.g[1],I=w.g[2];var E=w.g[3],_=m+(E^y&(I^E))+v[0]+3614090360&4294967295;m=y+(_<<7&4294967295|_>>>25),_=E+(I^m&(y^I))+v[1]+3905402710&4294967295,E=m+(_<<12&4294967295|_>>>20),_=I+(y^E&(m^y))+v[2]+606105819&4294967295,I=E+(_<<17&4294967295|_>>>15),_=y+(m^I&(E^m))+v[3]+3250441966&4294967295,y=I+(_<<22&4294967295|_>>>10),_=m+(E^y&(I^E))+v[4]+4118548399&4294967295,m=y+(_<<7&4294967295|_>>>25),_=E+(I^m&(y^I))+v[5]+1200080426&4294967295,E=m+(_<<12&4294967295|_>>>20),_=I+(y^E&(m^y))+v[6]+2821735955&4294967295,I=E+(_<<17&4294967295|_>>>15),_=y+(m^I&(E^m))+v[7]+4249261313&4294967295,y=I+(_<<22&4294967295|_>>>10),_=m+(E^y&(I^E))+v[8]+1770035416&4294967295,m=y+(_<<7&4294967295|_>>>25),_=E+(I^m&(y^I))+v[9]+2336552879&4294967295,E=m+(_<<12&4294967295|_>>>20),_=I+(y^E&(m^y))+v[10]+4294925233&4294967295,I=E+(_<<17&4294967295|_>>>15),_=y+(m^I&(E^m))+v[11]+2304563134&4294967295,y=I+(_<<22&4294967295|_>>>10),_=m+(E^y&(I^E))+v[12]+1804603682&4294967295,m=y+(_<<7&4294967295|_>>>25),_=E+(I^m&(y^I))+v[13]+4254626195&4294967295,E=m+(_<<12&4294967295|_>>>20),_=I+(y^E&(m^y))+v[14]+2792965006&4294967295,I=E+(_<<17&4294967295|_>>>15),_=y+(m^I&(E^m))+v[15]+1236535329&4294967295,y=I+(_<<22&4294967295|_>>>10),_=m+(I^E&(y^I))+v[1]+4129170786&4294967295,m=y+(_<<5&4294967295|_>>>27),_=E+(y^I&(m^y))+v[6]+3225465664&4294967295,E=m+(_<<9&4294967295|_>>>23),_=I+(m^y&(E^m))+v[11]+643717713&4294967295,I=E+(_<<14&4294967295|_>>>18),_=y+(E^m&(I^E))+v[0]+3921069994&4294967295,y=I+(_<<20&4294967295|_>>>12),_=m+(I^E&(y^I))+v[5]+3593408605&4294967295,m=y+(_<<5&4294967295|_>>>27),_=E+(y^I&(m^y))+v[10]+38016083&4294967295,E=m+(_<<9&4294967295|_>>>23),_=I+(m^y&(E^m))+v[15]+3634488961&4294967295,I=E+(_<<14&4294967295|_>>>18),_=y+(E^m&(I^E))+v[4]+3889429448&4294967295,y=I+(_<<20&4294967295|_>>>12),_=m+(I^E&(y^I))+v[9]+568446438&4294967295,m=y+(_<<5&4294967295|_>>>27),_=E+(y^I&(m^y))+v[14]+3275163606&4294967295,E=m+(_<<9&4294967295|_>>>23),_=I+(m^y&(E^m))+v[3]+4107603335&4294967295,I=E+(_<<14&4294967295|_>>>18),_=y+(E^m&(I^E))+v[8]+1163531501&4294967295,y=I+(_<<20&4294967295|_>>>12),_=m+(I^E&(y^I))+v[13]+2850285829&4294967295,m=y+(_<<5&4294967295|_>>>27),_=E+(y^I&(m^y))+v[2]+4243563512&4294967295,E=m+(_<<9&4294967295|_>>>23),_=I+(m^y&(E^m))+v[7]+1735328473&4294967295,I=E+(_<<14&4294967295|_>>>18),_=y+(E^m&(I^E))+v[12]+2368359562&4294967295,y=I+(_<<20&4294967295|_>>>12),_=m+(y^I^E)+v[5]+4294588738&4294967295,m=y+(_<<4&4294967295|_>>>28),_=E+(m^y^I)+v[8]+2272392833&4294967295,E=m+(_<<11&4294967295|_>>>21),_=I+(E^m^y)+v[11]+1839030562&4294967295,I=E+(_<<16&4294967295|_>>>16),_=y+(I^E^m)+v[14]+4259657740&4294967295,y=I+(_<<23&4294967295|_>>>9),_=m+(y^I^E)+v[1]+2763975236&4294967295,m=y+(_<<4&4294967295|_>>>28),_=E+(m^y^I)+v[4]+1272893353&4294967295,E=m+(_<<11&4294967295|_>>>21),_=I+(E^m^y)+v[7]+4139469664&4294967295,I=E+(_<<16&4294967295|_>>>16),_=y+(I^E^m)+v[10]+3200236656&4294967295,y=I+(_<<23&4294967295|_>>>9),_=m+(y^I^E)+v[13]+681279174&4294967295,m=y+(_<<4&4294967295|_>>>28),_=E+(m^y^I)+v[0]+3936430074&4294967295,E=m+(_<<11&4294967295|_>>>21),_=I+(E^m^y)+v[3]+3572445317&4294967295,I=E+(_<<16&4294967295|_>>>16),_=y+(I^E^m)+v[6]+76029189&4294967295,y=I+(_<<23&4294967295|_>>>9),_=m+(y^I^E)+v[9]+3654602809&4294967295,m=y+(_<<4&4294967295|_>>>28),_=E+(m^y^I)+v[12]+3873151461&4294967295,E=m+(_<<11&4294967295|_>>>21),_=I+(E^m^y)+v[15]+530742520&4294967295,I=E+(_<<16&4294967295|_>>>16),_=y+(I^E^m)+v[2]+3299628645&4294967295,y=I+(_<<23&4294967295|_>>>9),_=m+(I^(y|~E))+v[0]+4096336452&4294967295,m=y+(_<<6&4294967295|_>>>26),_=E+(y^(m|~I))+v[7]+1126891415&4294967295,E=m+(_<<10&4294967295|_>>>22),_=I+(m^(E|~y))+v[14]+2878612391&4294967295,I=E+(_<<15&4294967295|_>>>17),_=y+(E^(I|~m))+v[5]+4237533241&4294967295,y=I+(_<<21&4294967295|_>>>11),_=m+(I^(y|~E))+v[12]+1700485571&4294967295,m=y+(_<<6&4294967295|_>>>26),_=E+(y^(m|~I))+v[3]+2399980690&4294967295,E=m+(_<<10&4294967295|_>>>22),_=I+(m^(E|~y))+v[10]+4293915773&4294967295,I=E+(_<<15&4294967295|_>>>17),_=y+(E^(I|~m))+v[1]+2240044497&4294967295,y=I+(_<<21&4294967295|_>>>11),_=m+(I^(y|~E))+v[8]+1873313359&4294967295,m=y+(_<<6&4294967295|_>>>26),_=E+(y^(m|~I))+v[15]+4264355552&4294967295,E=m+(_<<10&4294967295|_>>>22),_=I+(m^(E|~y))+v[6]+2734768916&4294967295,I=E+(_<<15&4294967295|_>>>17),_=y+(E^(I|~m))+v[13]+1309151649&4294967295,y=I+(_<<21&4294967295|_>>>11),_=m+(I^(y|~E))+v[4]+4149444226&4294967295,m=y+(_<<6&4294967295|_>>>26),_=E+(y^(m|~I))+v[11]+3174756917&4294967295,E=m+(_<<10&4294967295|_>>>22),_=I+(m^(E|~y))+v[2]+718787259&4294967295,I=E+(_<<15&4294967295|_>>>17),_=y+(E^(I|~m))+v[9]+3951481745&4294967295,w.g[0]=w.g[0]+m&4294967295,w.g[1]=w.g[1]+(I+(_<<21&4294967295|_>>>11))&4294967295,w.g[2]=w.g[2]+I&4294967295,w.g[3]=w.g[3]+E&4294967295}r.prototype.u=function(w,m){m===void 0&&(m=w.length);for(var y=m-this.blockSize,v=this.B,I=this.h,E=0;E<m;){if(I==0)for(;E<=y;)i(this,w,E),E+=this.blockSize;if(typeof w=="string"){for(;E<m;)if(v[I++]=w.charCodeAt(E++),I==this.blockSize){i(this,v),I=0;break}}else for(;E<m;)if(v[I++]=w[E++],I==this.blockSize){i(this,v),I=0;break}}this.h=I,this.o+=m},r.prototype.v=function(){var w=Array((56>this.h?this.blockSize:2*this.blockSize)-this.h);w[0]=128;for(var m=1;m<w.length-8;++m)w[m]=0;var y=8*this.o;for(m=w.length-8;m<w.length;++m)w[m]=y&255,y/=256;for(this.u(w),w=Array(16),m=y=0;4>m;++m)for(var v=0;32>v;v+=8)w[y++]=this.g[m]>>>v&255;return w};function s(w,m){var y=c;return Object.prototype.hasOwnProperty.call(y,w)?y[w]:y[w]=m(w)}function a(w,m){this.h=m;for(var y=[],v=!0,I=w.length-1;0<=I;I--){var E=w[I]|0;v&&E==m||(y[I]=E,v=!1)}this.g=y}var c={};function u(w){return-128<=w&&128>w?s(w,function(m){return new a([m|0],0>m?-1:0)}):new a([w|0],0>w?-1:0)}function d(w){if(isNaN(w)||!isFinite(w))return g;if(0>w)return N(d(-w));for(var m=[],y=1,v=0;w>=y;v++)m[v]=w/y|0,y*=4294967296;return new a(m,0)}function f(w,m){if(w.length==0)throw Error("number format error: empty string");if(m=m||10,2>m||36<m)throw Error("radix out of range: "+m);if(w.charAt(0)=="-")return N(f(w.substring(1),m));if(0<=w.indexOf("-"))throw Error('number format error: interior "-" character');for(var y=d(Math.pow(m,8)),v=g,I=0;I<w.length;I+=8){var E=Math.min(8,w.length-I),_=parseInt(w.substring(I,I+E),m);8>E?(E=d(Math.pow(m,E)),v=v.j(E).add(d(_))):(v=v.j(y),v=v.add(d(_)))}return v}var g=u(0),b=u(1),R=u(16777216);n=a.prototype,n.m=function(){if(O(this))return-N(this).m();for(var w=0,m=1,y=0;y<this.g.length;y++){var v=this.i(y);w+=(0<=v?v:4294967296+v)*m,m*=4294967296}return w},n.toString=function(w){if(w=w||10,2>w||36<w)throw Error("radix out of range: "+w);if(k(this))return"0";if(O(this))return"-"+N(this).toString(w);for(var m=d(Math.pow(w,6)),y=this,v="";;){var I=B(y,m).g;y=Y(y,I.j(m));var E=((0<y.g.length?y.g[0]:y.h)>>>0).toString(w);if(y=I,k(y))return E+v;for(;6>E.length;)E="0"+E;v=E+v}},n.i=function(w){return 0>w?0:w<this.g.length?this.g[w]:this.h};function k(w){if(w.h!=0)return!1;for(var m=0;m<w.g.length;m++)if(w.g[m]!=0)return!1;return!0}function O(w){return w.h==-1}n.l=function(w){return w=Y(this,w),O(w)?-1:k(w)?0:1};function N(w){for(var m=w.g.length,y=[],v=0;v<m;v++)y[v]=~w.g[v];return new a(y,~w.h).add(b)}n.abs=function(){return O(this)?N(this):this},n.add=function(w){for(var m=Math.max(this.g.length,w.g.length),y=[],v=0,I=0;I<=m;I++){var E=v+(this.i(I)&65535)+(w.i(I)&65535),_=(E>>>16)+(this.i(I)>>>16)+(w.i(I)>>>16);v=_>>>16,E&=65535,_&=65535,y[I]=_<<16|E}return new a(y,y[y.length-1]&-2147483648?-1:0)};function Y(w,m){return w.add(N(m))}n.j=function(w){if(k(this)||k(w))return g;if(O(this))return O(w)?N(this).j(N(w)):N(N(this).j(w));if(O(w))return N(this.j(N(w)));if(0>this.l(R)&&0>w.l(R))return d(this.m()*w.m());for(var m=this.g.length+w.g.length,y=[],v=0;v<2*m;v++)y[v]=0;for(v=0;v<this.g.length;v++)for(var I=0;I<w.g.length;I++){var E=this.i(v)>>>16,_=this.i(v)&65535,pt=w.i(I)>>>16,vr=w.i(I)&65535;y[2*v+2*I]+=_*vr,z(y,2*v+2*I),y[2*v+2*I+1]+=E*vr,z(y,2*v+2*I+1),y[2*v+2*I+1]+=_*pt,z(y,2*v+2*I+1),y[2*v+2*I+2]+=E*pt,z(y,2*v+2*I+2)}for(v=0;v<m;v++)y[v]=y[2*v+1]<<16|y[2*v];for(v=m;v<2*m;v++)y[v]=0;return new a(y,0)};function z(w,m){for(;(w[m]&65535)!=w[m];)w[m+1]+=w[m]>>>16,w[m]&=65535,m++}function L(w,m){this.g=w,this.h=m}function B(w,m){if(k(m))throw Error("division by zero");if(k(w))return new L(g,g);if(O(w))return m=B(N(w),m),new L(N(m.g),N(m.h));if(O(m))return m=B(w,N(m)),new L(N(m.g),m.h);if(30<w.g.length){if(O(w)||O(m))throw Error("slowDivide_ only works with positive integers.");for(var y=b,v=m;0>=v.l(w);)y=H(y),v=H(v);var I=q(y,1),E=q(v,1);for(v=q(v,2),y=q(y,2);!k(v);){var _=E.add(v);0>=_.l(w)&&(I=I.add(y),E=_),v=q(v,1),y=q(y,1)}return m=Y(w,I.j(m)),new L(I,m)}for(I=g;0<=w.l(m);){for(y=Math.max(1,Math.floor(w.m()/m.m())),v=Math.ceil(Math.log(y)/Math.LN2),v=48>=v?1:Math.pow(2,v-48),E=d(y),_=E.j(m);O(_)||0<_.l(w);)y-=v,E=d(y),_=E.j(m);k(E)&&(E=b),I=I.add(E),w=Y(w,_)}return new L(I,w)}n.A=function(w){return B(this,w).h},n.and=function(w){for(var m=Math.max(this.g.length,w.g.length),y=[],v=0;v<m;v++)y[v]=this.i(v)&w.i(v);return new a(y,this.h&w.h)},n.or=function(w){for(var m=Math.max(this.g.length,w.g.length),y=[],v=0;v<m;v++)y[v]=this.i(v)|w.i(v);return new a(y,this.h|w.h)},n.xor=function(w){for(var m=Math.max(this.g.length,w.g.length),y=[],v=0;v<m;v++)y[v]=this.i(v)^w.i(v);return new a(y,this.h^w.h)};function H(w){for(var m=w.g.length+1,y=[],v=0;v<m;v++)y[v]=w.i(v)<<1|w.i(v-1)>>>31;return new a(y,w.h)}function q(w,m){var y=m>>5;m%=32;for(var v=w.g.length-y,I=[],E=0;E<v;E++)I[E]=0<m?w.i(E+y)>>>m|w.i(E+y+1)<<32-m:w.i(E+y);return new a(I,w.h)}r.prototype.digest=r.prototype.v,r.prototype.reset=r.prototype.s,r.prototype.update=r.prototype.u,Ip=vp.Md5=r,a.prototype.add=a.prototype.add,a.prototype.multiply=a.prototype.j,a.prototype.modulo=a.prototype.A,a.prototype.compare=a.prototype.l,a.prototype.toNumber=a.prototype.m,a.prototype.toString=a.prototype.toString,a.prototype.getBits=a.prototype.i,a.fromNumber=d,a.fromString=f,eo=vp.Integer=a}).apply(typeof wp<"u"?wp:typeof self<"u"?self:typeof window<"u"?window:{});var to=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{},Tt={};var Xc,FT,jn,Zc,ci,no,eu,tu,nu;(function(){var n,e=typeof Object.defineProperties=="function"?Object.defineProperty:function(o,l,h){return o==Array.prototype||o==Object.prototype||(o[l]=h.value),o};function t(o){o=[typeof globalThis=="object"&&globalThis,o,typeof window=="object"&&window,typeof self=="object"&&self,typeof to=="object"&&to];for(var l=0;l<o.length;++l){var h=o[l];if(h&&h.Math==Math)return h}throw Error("Cannot find global object")}var r=t(this);function i(o,l){if(l)e:{var h=r;o=o.split(".");for(var p=0;p<o.length-1;p++){var T=o[p];if(!(T in h))break e;h=h[T]}o=o[o.length-1],p=h[o],l=l(p),l!=p&&l!=null&&e(h,o,{configurable:!0,writable:!0,value:l})}}function s(o,l){o instanceof String&&(o+="");var h=0,p=!1,T={next:function(){if(!p&&h<o.length){var S=h++;return{value:l(S,o[S]),done:!1}}return p=!0,{done:!0,value:void 0}}};return T[Symbol.iterator]=function(){return T},T}i("Array.prototype.values",function(o){return o||function(){return s(this,function(l,h){return h})}});var a=a||{},c=this||self;function u(o){var l=typeof o;return l=l!="object"?l:o?Array.isArray(o)?"array":l:"null",l=="array"||l=="object"&&typeof o.length=="number"}function d(o){var l=typeof o;return l=="object"&&o!=null||l=="function"}function f(o,l,h){return o.call.apply(o.bind,arguments)}function g(o,l,h){if(!o)throw Error();if(2<arguments.length){var p=Array.prototype.slice.call(arguments,2);return function(){var T=Array.prototype.slice.call(arguments);return Array.prototype.unshift.apply(T,p),o.apply(l,T)}}return function(){return o.apply(l,arguments)}}function b(o,l,h){return b=Function.prototype.bind&&Function.prototype.bind.toString().indexOf("native code")!=-1?f:g,b.apply(null,arguments)}function R(o,l){var h=Array.prototype.slice.call(arguments,1);return function(){var p=h.slice();return p.push.apply(p,arguments),o.apply(this,p)}}function k(o,l){function h(){}h.prototype=l.prototype,o.aa=l.prototype,o.prototype=new h,o.prototype.constructor=o,o.Qb=function(p,T,S){for(var C=Array(arguments.length-2),X=2;X<arguments.length;X++)C[X-2]=arguments[X];return l.prototype[T].apply(p,C)}}function O(o){let l=o.length;if(0<l){let h=Array(l);for(let p=0;p<l;p++)h[p]=o[p];return h}return[]}function N(o,l){for(let h=1;h<arguments.length;h++){let p=arguments[h];if(u(p)){let T=o.length||0,S=p.length||0;o.length=T+S;for(let C=0;C<S;C++)o[T+C]=p[C]}else o.push(p)}}class Y{constructor(l,h){this.i=l,this.j=h,this.h=0,this.g=null}get(){let l;return 0<this.h?(this.h--,l=this.g,this.g=l.next,l.next=null):l=this.i(),l}}function z(o){return/^[\s\xa0]*$/.test(o)}function L(){var o=c.navigator;return o&&(o=o.userAgent)?o:""}function B(o){return B[" "](o),o}B[" "]=function(){};var H=L().indexOf("Gecko")!=-1&&!(L().toLowerCase().indexOf("webkit")!=-1&&L().indexOf("Edge")==-1)&&!(L().indexOf("Trident")!=-1||L().indexOf("MSIE")!=-1)&&L().indexOf("Edge")==-1;function q(o,l,h){for(let p in o)l.call(h,o[p],p,o)}function w(o,l){for(let h in o)l.call(void 0,o[h],h,o)}function m(o){let l={};for(let h in o)l[h]=o[h];return l}let y="constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");function v(o,l){let h,p;for(let T=1;T<arguments.length;T++){p=arguments[T];for(h in p)o[h]=p[h];for(let S=0;S<y.length;S++)h=y[S],Object.prototype.hasOwnProperty.call(p,h)&&(o[h]=p[h])}}function I(o){var l=1;o=o.split(":");let h=[];for(;0<l&&o.length;)h.push(o.shift()),l--;return o.length&&h.push(o.join(":")),h}function E(o){c.setTimeout(()=>{throw o},0)}function _(){var o=fa;let l=null;return o.g&&(l=o.g,o.g=o.g.next,o.g||(o.h=null),l.next=null),l}class pt{constructor(){this.h=this.g=null}add(l,h){let p=vr.get();p.set(l,h),this.h?this.h.next=p:this.g=p,this.h=p}}var vr=new Y(()=>new __,o=>o.reset());class __{constructor(){this.next=this.g=this.h=null}set(l,h){this.h=l,this.g=h,this.next=null}reset(){this.next=this.g=this.h=null}}let Ir,Tr=!1,fa=new pt,bh=()=>{let o=c.Promise.resolve(void 0);Ir=()=>{o.then(y_)}};var y_=()=>{for(var o;o=_();){try{o.h.call(o.g)}catch(h){E(h)}var l=vr;l.j(o),100>l.h&&(l.h++,o.next=l.g,l.g=o)}Tr=!1};function Pt(){this.s=this.s,this.C=this.C}Pt.prototype.s=!1,Pt.prototype.ma=function(){this.s||(this.s=!0,this.N())},Pt.prototype.N=function(){if(this.C)for(;this.C.length;)this.C.shift()()};function ve(o,l){this.type=o,this.g=this.target=l,this.defaultPrevented=!1}ve.prototype.h=function(){this.defaultPrevented=!0};var w_=function(){if(!c.addEventListener||!Object.defineProperty)return!1;var o=!1,l=Object.defineProperty({},"passive",{get:function(){o=!0}});try{let h=()=>{};c.addEventListener("test",h,l),c.removeEventListener("test",h,l)}catch{}return o}();function Er(o,l){if(ve.call(this,o?o.type:""),this.relatedTarget=this.g=this.target=null,this.button=this.screenY=this.screenX=this.clientY=this.clientX=0,this.key="",this.metaKey=this.shiftKey=this.altKey=this.ctrlKey=!1,this.state=null,this.pointerId=0,this.pointerType="",this.i=null,o){var h=this.type=o.type,p=o.changedTouches&&o.changedTouches.length?o.changedTouches[0]:null;if(this.target=o.target||o.srcElement,this.g=l,l=o.relatedTarget){if(H){e:{try{B(l.nodeName);var T=!0;break e}catch{}T=!1}T||(l=null)}}else h=="mouseover"?l=o.fromElement:h=="mouseout"&&(l=o.toElement);this.relatedTarget=l,p?(this.clientX=p.clientX!==void 0?p.clientX:p.pageX,this.clientY=p.clientY!==void 0?p.clientY:p.pageY,this.screenX=p.screenX||0,this.screenY=p.screenY||0):(this.clientX=o.clientX!==void 0?o.clientX:o.pageX,this.clientY=o.clientY!==void 0?o.clientY:o.pageY,this.screenX=o.screenX||0,this.screenY=o.screenY||0),this.button=o.button,this.key=o.key||"",this.ctrlKey=o.ctrlKey,this.altKey=o.altKey,this.shiftKey=o.shiftKey,this.metaKey=o.metaKey,this.pointerId=o.pointerId||0,this.pointerType=typeof o.pointerType=="string"?o.pointerType:v_[o.pointerType]||"",this.state=o.state,this.i=o,o.defaultPrevented&&Er.aa.h.call(this)}}k(Er,ve);var v_={2:"touch",3:"pen",4:"mouse"};Er.prototype.h=function(){Er.aa.h.call(this);var o=this.i;o.preventDefault?o.preventDefault():o.returnValue=!1};var br="closure_listenable_"+(1e6*Math.random()|0),I_=0;function T_(o,l,h,p,T){this.listener=o,this.proxy=null,this.src=l,this.type=h,this.capture=!!p,this.ha=T,this.key=++I_,this.da=this.fa=!1}function ji(o){o.da=!0,o.listener=null,o.proxy=null,o.src=null,o.ha=null}function zi(o){this.src=o,this.g={},this.h=0}zi.prototype.add=function(o,l,h,p,T){var S=o.toString();o=this.g[S],o||(o=this.g[S]=[],this.h++);var C=ma(o,l,p,T);return-1<C?(l=o[C],h||(l.fa=!1)):(l=new T_(l,this.src,S,!!p,T),l.fa=h,o.push(l)),l};function pa(o,l){var h=l.type;if(h in o.g){var p=o.g[h],T=Array.prototype.indexOf.call(p,l,void 0),S;(S=0<=T)&&Array.prototype.splice.call(p,T,1),S&&(ji(l),o.g[h].length==0&&(delete o.g[h],o.h--))}}function ma(o,l,h,p){for(var T=0;T<o.length;++T){var S=o[T];if(!S.da&&S.listener==l&&S.capture==!!h&&S.ha==p)return T}return-1}var ga="closure_lm_"+(1e6*Math.random()|0),_a={};function Ah(o,l,h,p,T){if(p&&p.once)return Rh(o,l,h,p,T);if(Array.isArray(l)){for(var S=0;S<l.length;S++)Ah(o,l[S],h,p,T);return null}return h=Ia(h),o&&o[br]?o.K(l,h,d(p)?!!p.capture:!!p,T):Sh(o,l,h,!1,p,T)}function Sh(o,l,h,p,T,S){if(!l)throw Error("Invalid event type");var C=d(T)?!!T.capture:!!T,X=wa(o);if(X||(o[ga]=X=new zi(o)),h=X.add(l,h,p,C,S),h.proxy)return h;if(p=E_(),h.proxy=p,p.src=o,p.listener=h,o.addEventListener)w_||(T=C),T===void 0&&(T=!1),o.addEventListener(l.toString(),p,T);else if(o.attachEvent)o.attachEvent(kh(l.toString()),p);else if(o.addListener&&o.removeListener)o.addListener(p);else throw Error("addEventListener and attachEvent are unavailable.");return h}function E_(){function o(h){return l.call(o.src,o.listener,h)}let l=b_;return o}function Rh(o,l,h,p,T){if(Array.isArray(l)){for(var S=0;S<l.length;S++)Rh(o,l[S],h,p,T);return null}return h=Ia(h),o&&o[br]?o.L(l,h,d(p)?!!p.capture:!!p,T):Sh(o,l,h,!0,p,T)}function Ph(o,l,h,p,T){if(Array.isArray(l))for(var S=0;S<l.length;S++)Ph(o,l[S],h,p,T);else p=d(p)?!!p.capture:!!p,h=Ia(h),o&&o[br]?(o=o.i,l=String(l).toString(),l in o.g&&(S=o.g[l],h=ma(S,h,p,T),-1<h&&(ji(S[h]),Array.prototype.splice.call(S,h,1),S.length==0&&(delete o.g[l],o.h--)))):o&&(o=wa(o))&&(l=o.g[l.toString()],o=-1,l&&(o=ma(l,h,p,T)),(h=-1<o?l[o]:null)&&ya(h))}function ya(o){if(typeof o!="number"&&o&&!o.da){var l=o.src;if(l&&l[br])pa(l.i,o);else{var h=o.type,p=o.proxy;l.removeEventListener?l.removeEventListener(h,p,o.capture):l.detachEvent?l.detachEvent(kh(h),p):l.addListener&&l.removeListener&&l.removeListener(p),(h=wa(l))?(pa(h,o),h.h==0&&(h.src=null,l[ga]=null)):ji(o)}}}function kh(o){return o in _a?_a[o]:_a[o]="on"+o}function b_(o,l){if(o.da)o=!0;else{l=new Er(l,this);var h=o.listener,p=o.ha||o.src;o.fa&&ya(o),o=h.call(p,l)}return o}function wa(o){return o=o[ga],o instanceof zi?o:null}var va="__closure_events_fn_"+(1e9*Math.random()>>>0);function Ia(o){return typeof o=="function"?o:(o[va]||(o[va]=function(l){return o.handleEvent(l)}),o[va])}function Ie(){Pt.call(this),this.i=new zi(this),this.M=this,this.F=null}k(Ie,Pt),Ie.prototype[br]=!0,Ie.prototype.removeEventListener=function(o,l,h,p){Ph(this,o,l,h,p)};function Re(o,l){var h,p=o.F;if(p)for(h=[];p;p=p.F)h.push(p);if(o=o.M,p=l.type||l,typeof l=="string")l=new ve(l,o);else if(l instanceof ve)l.target=l.target||o;else{var T=l;l=new ve(p,o),v(l,T)}if(T=!0,h)for(var S=h.length-1;0<=S;S--){var C=l.g=h[S];T=$i(C,p,!0,l)&&T}if(C=l.g=o,T=$i(C,p,!0,l)&&T,T=$i(C,p,!1,l)&&T,h)for(S=0;S<h.length;S++)C=l.g=h[S],T=$i(C,p,!1,l)&&T}Ie.prototype.N=function(){if(Ie.aa.N.call(this),this.i){var o=this.i,l;for(l in o.g){for(var h=o.g[l],p=0;p<h.length;p++)ji(h[p]);delete o.g[l],o.h--}}this.F=null},Ie.prototype.K=function(o,l,h,p){return this.i.add(String(o),l,!1,h,p)},Ie.prototype.L=function(o,l,h,p){return this.i.add(String(o),l,!0,h,p)};function $i(o,l,h,p){if(l=o.i.g[String(l)],!l)return!0;l=l.concat();for(var T=!0,S=0;S<l.length;++S){var C=l[S];if(C&&!C.da&&C.capture==h){var X=C.listener,_e=C.ha||C.src;C.fa&&pa(o.i,C),T=X.call(_e,p)!==!1&&T}}return T&&!p.defaultPrevented}function Ch(o,l,h){if(typeof o=="function")h&&(o=b(o,h));else if(o&&typeof o.handleEvent=="function")o=b(o.handleEvent,o);else throw Error("Invalid listener argument");return 2147483647<Number(l)?-1:c.setTimeout(o,l||0)}function Dh(o){o.g=Ch(()=>{o.g=null,o.i&&(o.i=!1,Dh(o))},o.l);let l=o.h;o.h=null,o.m.apply(null,l)}class A_ extends Pt{constructor(l,h){super(),this.m=l,this.l=h,this.h=null,this.i=!1,this.g=null}j(l){this.h=arguments,this.g?this.i=!0:Dh(this)}N(){super.N(),this.g&&(c.clearTimeout(this.g),this.g=null,this.i=!1,this.h=null)}}function Ar(o){Pt.call(this),this.h=o,this.g={}}k(Ar,Pt);var Nh=[];function Oh(o){q(o.g,function(l,h){this.g.hasOwnProperty(h)&&ya(l)},o),o.g={}}Ar.prototype.N=function(){Ar.aa.N.call(this),Oh(this)},Ar.prototype.handleEvent=function(){throw Error("EventHandler.handleEvent not implemented")};var Ta=c.JSON.stringify,S_=c.JSON.parse,R_=class{stringify(o){return c.JSON.stringify(o,void 0)}parse(o){return c.JSON.parse(o,void 0)}};function Ea(){}Ea.prototype.h=null;function xh(o){return o.h||(o.h=o.i())}function Vh(){}var Sr={OPEN:"a",kb:"b",Ja:"c",wb:"d"};function ba(){ve.call(this,"d")}k(ba,ve);function Aa(){ve.call(this,"c")}k(Aa,ve);var Qt={},Lh=null;function Ki(){return Lh=Lh||new Ie}Qt.La="serverreachability";function Mh(o){ve.call(this,Qt.La,o)}k(Mh,ve);function Rr(o){let l=Ki();Re(l,new Mh(l))}Qt.STAT_EVENT="statevent";function Fh(o,l){ve.call(this,Qt.STAT_EVENT,o),this.stat=l}k(Fh,ve);function Pe(o){let l=Ki();Re(l,new Fh(l,o))}Qt.Ma="timingevent";function Uh(o,l){ve.call(this,Qt.Ma,o),this.size=l}k(Uh,ve);function Pr(o,l){if(typeof o!="function")throw Error("Fn must not be null and must be a function");return c.setTimeout(function(){o()},l)}function kr(){this.g=!0}kr.prototype.xa=function(){this.g=!1};function P_(o,l,h,p,T,S){o.info(function(){if(o.g)if(S)for(var C="",X=S.split("&"),_e=0;_e<X.length;_e++){var W=X[_e].split("=");if(1<W.length){var Te=W[0];W=W[1];var Ee=Te.split("_");C=2<=Ee.length&&Ee[1]=="type"?C+(Te+"="+W+"&"):C+(Te+"=redacted&")}}else C=null;else C=S;return"XMLHTTP REQ ("+p+") [attempt "+T+"]: "+l+`
`+h+`
`+C})}function k_(o,l,h,p,T,S,C){o.info(function(){return"XMLHTTP RESP ("+p+") [ attempt "+T+"]: "+l+`
`+h+`
`+S+" "+C})}function Dn(o,l,h,p){o.info(function(){return"XMLHTTP TEXT ("+l+"): "+D_(o,h)+(p?" "+p:"")})}function C_(o,l){o.info(function(){return"TIMEOUT: "+l})}kr.prototype.info=function(){};function D_(o,l){if(!o.g)return l;if(!l)return null;try{var h=JSON.parse(l);if(h){for(o=0;o<h.length;o++)if(Array.isArray(h[o])){var p=h[o];if(!(2>p.length)){var T=p[1];if(Array.isArray(T)&&!(1>T.length)){var S=T[0];if(S!="noop"&&S!="stop"&&S!="close")for(var C=1;C<T.length;C++)T[C]=""}}}}return Ta(h)}catch{return l}}var Gi={NO_ERROR:0,gb:1,tb:2,sb:3,nb:4,rb:5,ub:6,Ia:7,TIMEOUT:8,xb:9},Bh={lb:"complete",Hb:"success",Ja:"error",Ia:"abort",zb:"ready",Ab:"readystatechange",TIMEOUT:"timeout",vb:"incrementaldata",yb:"progress",ob:"downloadprogress",Pb:"uploadprogress"},Sa;function Hi(){}k(Hi,Ea),Hi.prototype.g=function(){return new XMLHttpRequest},Hi.prototype.i=function(){return{}},Sa=new Hi;function kt(o,l,h,p){this.j=o,this.i=l,this.l=h,this.R=p||1,this.U=new Ar(this),this.I=45e3,this.H=null,this.o=!1,this.m=this.A=this.v=this.L=this.F=this.S=this.B=null,this.D=[],this.g=null,this.C=0,this.s=this.u=null,this.X=-1,this.J=!1,this.O=0,this.M=null,this.W=this.K=this.T=this.P=!1,this.h=new qh}function qh(){this.i=null,this.g="",this.h=!1}var jh={},Ra={};function Pa(o,l,h){o.L=1,o.v=Ji(mt(l)),o.m=h,o.P=!0,zh(o,null)}function zh(o,l){o.F=Date.now(),Wi(o),o.A=mt(o.v);var h=o.A,p=o.R;Array.isArray(p)||(p=[String(p)]),rd(h.i,"t",p),o.C=0,h=o.j.J,o.h=new qh,o.g=Id(o.j,h?l:null,!o.m),0<o.O&&(o.M=new A_(b(o.Y,o,o.g),o.O)),l=o.U,h=o.g,p=o.ca;var T="readystatechange";Array.isArray(T)||(T&&(Nh[0]=T.toString()),T=Nh);for(var S=0;S<T.length;S++){var C=Ah(h,T[S],p||l.handleEvent,!1,l.h||l);if(!C)break;l.g[C.key]=C}l=o.H?m(o.H):{},o.m?(o.u||(o.u="POST"),l["Content-Type"]="application/x-www-form-urlencoded",o.g.ea(o.A,o.u,o.m,l)):(o.u="GET",o.g.ea(o.A,o.u,null,l)),Rr(),P_(o.i,o.u,o.A,o.l,o.R,o.m)}kt.prototype.ca=function(o){o=o.target;let l=this.M;l&&gt(o)==3?l.j():this.Y(o)},kt.prototype.Y=function(o){try{if(o==this.g)e:{let Ee=gt(this.g);var l=this.g.Ba();let xn=this.g.Z();if(!(3>Ee)&&(Ee!=3||this.g&&(this.h.h||this.g.oa()||ld(this.g)))){this.J||Ee!=4||l==7||(l==8||0>=xn?Rr(3):Rr(2)),ka(this);var h=this.g.Z();this.X=h;t:if($h(this)){var p=ld(this.g);o="";var T=p.length,S=gt(this.g)==4;if(!this.h.i){if(typeof TextDecoder>"u"){Yt(this),Cr(this);var C="";break t}this.h.i=new c.TextDecoder}for(l=0;l<T;l++)this.h.h=!0,o+=this.h.i.decode(p[l],{stream:!(S&&l==T-1)});p.length=0,this.h.g+=o,this.C=0,C=this.h.g}else C=this.g.oa();if(this.o=h==200,k_(this.i,this.u,this.A,this.l,this.R,Ee,h),this.o){if(this.T&&!this.K){t:{if(this.g){var X,_e=this.g;if((X=_e.g?_e.g.getResponseHeader("X-HTTP-Initial-Response"):null)&&!z(X)){var W=X;break t}}W=null}if(h=W)Dn(this.i,this.l,h,"Initial handshake response via X-HTTP-Initial-Response"),this.K=!0,Ca(this,h);else{this.o=!1,this.s=3,Pe(12),Yt(this),Cr(this);break e}}if(this.P){h=!0;let Ke;for(;!this.J&&this.C<C.length;)if(Ke=N_(this,C),Ke==Ra){Ee==4&&(this.s=4,Pe(14),h=!1),Dn(this.i,this.l,null,"[Incomplete Response]");break}else if(Ke==jh){this.s=4,Pe(15),Dn(this.i,this.l,C,"[Invalid Chunk]"),h=!1;break}else Dn(this.i,this.l,Ke,null),Ca(this,Ke);if($h(this)&&this.C!=0&&(this.h.g=this.h.g.slice(this.C),this.C=0),Ee!=4||C.length!=0||this.h.h||(this.s=1,Pe(16),h=!1),this.o=this.o&&h,!h)Dn(this.i,this.l,C,"[Invalid Chunked Response]"),Yt(this),Cr(this);else if(0<C.length&&!this.W){this.W=!0;var Te=this.j;Te.g==this&&Te.ba&&!Te.M&&(Te.j.info("Great, no buffering proxy detected. Bytes received: "+C.length),La(Te),Te.M=!0,Pe(11))}}else Dn(this.i,this.l,C,null),Ca(this,C);Ee==4&&Yt(this),this.o&&!this.J&&(Ee==4?_d(this.j,this):(this.o=!1,Wi(this)))}else Q_(this.g),h==400&&0<C.indexOf("Unknown SID")?(this.s=3,Pe(12)):(this.s=0,Pe(13)),Yt(this),Cr(this)}}}catch{}finally{}};function $h(o){return o.g?o.u=="GET"&&o.L!=2&&o.j.Ca:!1}function N_(o,l){var h=o.C,p=l.indexOf(`
`,h);return p==-1?Ra:(h=Number(l.substring(h,p)),isNaN(h)?jh:(p+=1,p+h>l.length?Ra:(l=l.slice(p,p+h),o.C=p+h,l)))}kt.prototype.cancel=function(){this.J=!0,Yt(this)};function Wi(o){o.S=Date.now()+o.I,Kh(o,o.I)}function Kh(o,l){if(o.B!=null)throw Error("WatchDog timer not null");o.B=Pr(b(o.ba,o),l)}function ka(o){o.B&&(c.clearTimeout(o.B),o.B=null)}kt.prototype.ba=function(){this.B=null;let o=Date.now();0<=o-this.S?(C_(this.i,this.A),this.L!=2&&(Rr(),Pe(17)),Yt(this),this.s=2,Cr(this)):Kh(this,this.S-o)};function Cr(o){o.j.G==0||o.J||_d(o.j,o)}function Yt(o){ka(o);var l=o.M;l&&typeof l.ma=="function"&&l.ma(),o.M=null,Oh(o.U),o.g&&(l=o.g,o.g=null,l.abort(),l.ma())}function Ca(o,l){try{var h=o.j;if(h.G!=0&&(h.g==o||Da(h.h,o))){if(!o.K&&Da(h.h,o)&&h.G==3){try{var p=h.Da.g.parse(l)}catch{p=null}if(Array.isArray(p)&&p.length==3){var T=p;if(T[0]==0){e:if(!h.u){if(h.g)if(h.g.F+3e3<o.F)ns(h),es(h);else break e;Va(h),Pe(18)}}else h.za=T[1],0<h.za-h.T&&37500>T[2]&&h.F&&h.v==0&&!h.C&&(h.C=Pr(b(h.Za,h),6e3));if(1>=Wh(h.h)&&h.ca){try{h.ca()}catch{}h.ca=void 0}}else Xt(h,11)}else if((o.K||h.g==o)&&ns(h),!z(l))for(T=h.Da.g.parse(l),l=0;l<T.length;l++){let W=T[l];if(h.T=W[0],W=W[1],h.G==2)if(W[0]=="c"){h.K=W[1],h.ia=W[2];let Te=W[3];Te!=null&&(h.la=Te,h.j.info("VER="+h.la));let Ee=W[4];Ee!=null&&(h.Aa=Ee,h.j.info("SVER="+h.Aa));let xn=W[5];xn!=null&&typeof xn=="number"&&0<xn&&(p=1.5*xn,h.L=p,h.j.info("backChannelRequestTimeoutMs_="+p)),p=h;let Ke=o.g;if(Ke){let is=Ke.g?Ke.g.getResponseHeader("X-Client-Wire-Protocol"):null;if(is){var S=p.h;S.g||is.indexOf("spdy")==-1&&is.indexOf("quic")==-1&&is.indexOf("h2")==-1||(S.j=S.l,S.g=new Set,S.h&&(Na(S,S.h),S.h=null))}if(p.D){let Ma=Ke.g?Ke.g.getResponseHeader("X-HTTP-Session-Id"):null;Ma&&(p.ya=Ma,ee(p.I,p.D,Ma))}}h.G=3,h.l&&h.l.ua(),h.ba&&(h.R=Date.now()-o.F,h.j.info("Handshake RTT: "+h.R+"ms")),p=h;var C=o;if(p.qa=vd(p,p.J?p.ia:null,p.W),C.K){Qh(p.h,C);var X=C,_e=p.L;_e&&(X.I=_e),X.B&&(ka(X),Wi(X)),p.g=C}else md(p);0<h.i.length&&ts(h)}else W[0]!="stop"&&W[0]!="close"||Xt(h,7);else h.G==3&&(W[0]=="stop"||W[0]=="close"?W[0]=="stop"?Xt(h,7):xa(h):W[0]!="noop"&&h.l&&h.l.ta(W),h.v=0)}}Rr(4)}catch{}}var O_=class{constructor(o,l){this.g=o,this.map=l}};function Gh(o){this.l=o||10,c.PerformanceNavigationTiming?(o=c.performance.getEntriesByType("navigation"),o=0<o.length&&(o[0].nextHopProtocol=="hq"||o[0].nextHopProtocol=="h2")):o=!!(c.chrome&&c.chrome.loadTimes&&c.chrome.loadTimes()&&c.chrome.loadTimes().wasFetchedViaSpdy),this.j=o?this.l:1,this.g=null,1<this.j&&(this.g=new Set),this.h=null,this.i=[]}function Hh(o){return o.h?!0:o.g?o.g.size>=o.j:!1}function Wh(o){return o.h?1:o.g?o.g.size:0}function Da(o,l){return o.h?o.h==l:o.g?o.g.has(l):!1}function Na(o,l){o.g?o.g.add(l):o.h=l}function Qh(o,l){o.h&&o.h==l?o.h=null:o.g&&o.g.has(l)&&o.g.delete(l)}Gh.prototype.cancel=function(){if(this.i=Yh(this),this.h)this.h.cancel(),this.h=null;else if(this.g&&this.g.size!==0){for(let o of this.g.values())o.cancel();this.g.clear()}};function Yh(o){if(o.h!=null)return o.i.concat(o.h.D);if(o.g!=null&&o.g.size!==0){let l=o.i;for(let h of o.g.values())l=l.concat(h.D);return l}return O(o.i)}function x_(o){if(o.V&&typeof o.V=="function")return o.V();if(typeof Map<"u"&&o instanceof Map||typeof Set<"u"&&o instanceof Set)return Array.from(o.values());if(typeof o=="string")return o.split("");if(u(o)){for(var l=[],h=o.length,p=0;p<h;p++)l.push(o[p]);return l}l=[],h=0;for(p in o)l[h++]=o[p];return l}function V_(o){if(o.na&&typeof o.na=="function")return o.na();if(!o.V||typeof o.V!="function"){if(typeof Map<"u"&&o instanceof Map)return Array.from(o.keys());if(!(typeof Set<"u"&&o instanceof Set)){if(u(o)||typeof o=="string"){var l=[];o=o.length;for(var h=0;h<o;h++)l.push(h);return l}l=[],h=0;for(let p in o)l[h++]=p;return l}}}function Jh(o,l){if(o.forEach&&typeof o.forEach=="function")o.forEach(l,void 0);else if(u(o)||typeof o=="string")Array.prototype.forEach.call(o,l,void 0);else for(var h=V_(o),p=x_(o),T=p.length,S=0;S<T;S++)l.call(void 0,p[S],h&&h[S],o)}var Xh=RegExp("^(?:([^:/?#.]+):)?(?://(?:([^\\\\/?#]*)@)?([^\\\\/?#]*?)(?::([0-9]+))?(?=[\\\\/?#]|$))?([^?#]+)?(?:\\?([^#]*))?(?:#([\\s\\S]*))?$");function L_(o,l){if(o){o=o.split("&");for(var h=0;h<o.length;h++){var p=o[h].indexOf("="),T=null;if(0<=p){var S=o[h].substring(0,p);T=o[h].substring(p+1)}else S=o[h];l(S,T?decodeURIComponent(T.replace(/\+/g," ")):"")}}}function Jt(o){if(this.g=this.o=this.j="",this.s=null,this.m=this.l="",this.h=!1,o instanceof Jt){this.h=o.h,Qi(this,o.j),this.o=o.o,this.g=o.g,Yi(this,o.s),this.l=o.l;var l=o.i,h=new Or;h.i=l.i,l.g&&(h.g=new Map(l.g),h.h=l.h),Zh(this,h),this.m=o.m}else o&&(l=String(o).match(Xh))?(this.h=!1,Qi(this,l[1]||"",!0),this.o=Dr(l[2]||""),this.g=Dr(l[3]||"",!0),Yi(this,l[4]),this.l=Dr(l[5]||"",!0),Zh(this,l[6]||"",!0),this.m=Dr(l[7]||"")):(this.h=!1,this.i=new Or(null,this.h))}Jt.prototype.toString=function(){var o=[],l=this.j;l&&o.push(Nr(l,ed,!0),":");var h=this.g;return(h||l=="file")&&(o.push("//"),(l=this.o)&&o.push(Nr(l,ed,!0),"@"),o.push(encodeURIComponent(String(h)).replace(/%25([0-9a-fA-F]{2})/g,"%$1")),h=this.s,h!=null&&o.push(":",String(h))),(h=this.l)&&(this.g&&h.charAt(0)!="/"&&o.push("/"),o.push(Nr(h,h.charAt(0)=="/"?U_:F_,!0))),(h=this.i.toString())&&o.push("?",h),(h=this.m)&&o.push("#",Nr(h,q_)),o.join("")};function mt(o){return new Jt(o)}function Qi(o,l,h){o.j=h?Dr(l,!0):l,o.j&&(o.j=o.j.replace(/:$/,""))}function Yi(o,l){if(l){if(l=Number(l),isNaN(l)||0>l)throw Error("Bad port number "+l);o.s=l}else o.s=null}function Zh(o,l,h){l instanceof Or?(o.i=l,j_(o.i,o.h)):(h||(l=Nr(l,B_)),o.i=new Or(l,o.h))}function ee(o,l,h){o.i.set(l,h)}function Ji(o){return ee(o,"zx",Math.floor(2147483648*Math.random()).toString(36)+Math.abs(Math.floor(2147483648*Math.random())^Date.now()).toString(36)),o}function Dr(o,l){return o?l?decodeURI(o.replace(/%25/g,"%2525")):decodeURIComponent(o):""}function Nr(o,l,h){return typeof o=="string"?(o=encodeURI(o).replace(l,M_),h&&(o=o.replace(/%25([0-9a-fA-F]{2})/g,"%$1")),o):null}function M_(o){return o=o.charCodeAt(0),"%"+(o>>4&15).toString(16)+(o&15).toString(16)}var ed=/[#\/\?@]/g,F_=/[#\?:]/g,U_=/[#\?]/g,B_=/[#\?@]/g,q_=/#/g;function Or(o,l){this.h=this.g=null,this.i=o||null,this.j=!!l}function Ct(o){o.g||(o.g=new Map,o.h=0,o.i&&L_(o.i,function(l,h){o.add(decodeURIComponent(l.replace(/\+/g," ")),h)}))}n=Or.prototype,n.add=function(o,l){Ct(this),this.i=null,o=Nn(this,o);var h=this.g.get(o);return h||this.g.set(o,h=[]),h.push(l),this.h+=1,this};function td(o,l){Ct(o),l=Nn(o,l),o.g.has(l)&&(o.i=null,o.h-=o.g.get(l).length,o.g.delete(l))}function nd(o,l){return Ct(o),l=Nn(o,l),o.g.has(l)}n.forEach=function(o,l){Ct(this),this.g.forEach(function(h,p){h.forEach(function(T){o.call(l,T,p,this)},this)},this)},n.na=function(){Ct(this);let o=Array.from(this.g.values()),l=Array.from(this.g.keys()),h=[];for(let p=0;p<l.length;p++){let T=o[p];for(let S=0;S<T.length;S++)h.push(l[p])}return h},n.V=function(o){Ct(this);let l=[];if(typeof o=="string")nd(this,o)&&(l=l.concat(this.g.get(Nn(this,o))));else{o=Array.from(this.g.values());for(let h=0;h<o.length;h++)l=l.concat(o[h])}return l},n.set=function(o,l){return Ct(this),this.i=null,o=Nn(this,o),nd(this,o)&&(this.h-=this.g.get(o).length),this.g.set(o,[l]),this.h+=1,this},n.get=function(o,l){return o?(o=this.V(o),0<o.length?String(o[0]):l):l};function rd(o,l,h){td(o,l),0<h.length&&(o.i=null,o.g.set(Nn(o,l),O(h)),o.h+=h.length)}n.toString=function(){if(this.i)return this.i;if(!this.g)return"";let o=[],l=Array.from(this.g.keys());for(var h=0;h<l.length;h++){var p=l[h];let S=encodeURIComponent(String(p)),C=this.V(p);for(p=0;p<C.length;p++){var T=S;C[p]!==""&&(T+="="+encodeURIComponent(String(C[p]))),o.push(T)}}return this.i=o.join("&")};function Nn(o,l){return l=String(l),o.j&&(l=l.toLowerCase()),l}function j_(o,l){l&&!o.j&&(Ct(o),o.i=null,o.g.forEach(function(h,p){var T=p.toLowerCase();p!=T&&(td(this,p),rd(this,T,h))},o)),o.j=l}function z_(o,l){let h=new kr;if(c.Image){let p=new Image;p.onload=R(Dt,h,"TestLoadImage: loaded",!0,l,p),p.onerror=R(Dt,h,"TestLoadImage: error",!1,l,p),p.onabort=R(Dt,h,"TestLoadImage: abort",!1,l,p),p.ontimeout=R(Dt,h,"TestLoadImage: timeout",!1,l,p),c.setTimeout(function(){p.ontimeout&&p.ontimeout()},1e4),p.src=o}else l(!1)}function $_(o,l){let h=new kr,p=new AbortController,T=setTimeout(()=>{p.abort(),Dt(h,"TestPingServer: timeout",!1,l)},1e4);fetch(o,{signal:p.signal}).then(S=>{clearTimeout(T),S.ok?Dt(h,"TestPingServer: ok",!0,l):Dt(h,"TestPingServer: server error",!1,l)}).catch(()=>{clearTimeout(T),Dt(h,"TestPingServer: error",!1,l)})}function Dt(o,l,h,p,T){try{T&&(T.onload=null,T.onerror=null,T.onabort=null,T.ontimeout=null),p(h)}catch{}}function K_(){this.g=new R_}function G_(o,l,h){let p=h||"";try{Jh(o,function(T,S){let C=T;d(T)&&(C=Ta(T)),l.push(p+S+"="+encodeURIComponent(C))})}catch(T){throw l.push(p+"type="+encodeURIComponent("_badmap")),T}}function xr(o){this.l=o.Ub||null,this.j=o.eb||!1}k(xr,Ea),xr.prototype.g=function(){return new Xi(this.l,this.j)},xr.prototype.i=function(o){return function(){return o}}({});function Xi(o,l){Ie.call(this),this.D=o,this.o=l,this.m=void 0,this.status=this.readyState=0,this.responseType=this.responseText=this.response=this.statusText="",this.onreadystatechange=null,this.u=new Headers,this.h=null,this.B="GET",this.A="",this.g=!1,this.v=this.j=this.l=null}k(Xi,Ie),n=Xi.prototype,n.open=function(o,l){if(this.readyState!=0)throw this.abort(),Error("Error reopening a connection");this.B=o,this.A=l,this.readyState=1,Lr(this)},n.send=function(o){if(this.readyState!=1)throw this.abort(),Error("need to call open() first. ");this.g=!0;let l={headers:this.u,method:this.B,credentials:this.m,cache:void 0};o&&(l.body=o),(this.D||c).fetch(new Request(this.A,l)).then(this.Sa.bind(this),this.ga.bind(this))},n.abort=function(){this.response=this.responseText="",this.u=new Headers,this.status=0,this.j&&this.j.cancel("Request was aborted.").catch(()=>{}),1<=this.readyState&&this.g&&this.readyState!=4&&(this.g=!1,Vr(this)),this.readyState=0},n.Sa=function(o){if(this.g&&(this.l=o,this.h||(this.status=this.l.status,this.statusText=this.l.statusText,this.h=o.headers,this.readyState=2,Lr(this)),this.g&&(this.readyState=3,Lr(this),this.g)))if(this.responseType==="arraybuffer")o.arrayBuffer().then(this.Qa.bind(this),this.ga.bind(this));else if(typeof c.ReadableStream<"u"&&"body"in o){if(this.j=o.body.getReader(),this.o){if(this.responseType)throw Error('responseType must be empty for "streamBinaryChunks" mode responses.');this.response=[]}else this.response=this.responseText="",this.v=new TextDecoder;id(this)}else o.text().then(this.Ra.bind(this),this.ga.bind(this))};function id(o){o.j.read().then(o.Pa.bind(o)).catch(o.ga.bind(o))}n.Pa=function(o){if(this.g){if(this.o&&o.value)this.response.push(o.value);else if(!this.o){var l=o.value?o.value:new Uint8Array(0);(l=this.v.decode(l,{stream:!o.done}))&&(this.response=this.responseText+=l)}o.done?Vr(this):Lr(this),this.readyState==3&&id(this)}},n.Ra=function(o){this.g&&(this.response=this.responseText=o,Vr(this))},n.Qa=function(o){this.g&&(this.response=o,Vr(this))},n.ga=function(){this.g&&Vr(this)};function Vr(o){o.readyState=4,o.l=null,o.j=null,o.v=null,Lr(o)}n.setRequestHeader=function(o,l){this.u.append(o,l)},n.getResponseHeader=function(o){return this.h&&this.h.get(o.toLowerCase())||""},n.getAllResponseHeaders=function(){if(!this.h)return"";let o=[],l=this.h.entries();for(var h=l.next();!h.done;)h=h.value,o.push(h[0]+": "+h[1]),h=l.next();return o.join(`\r
`)};function Lr(o){o.onreadystatechange&&o.onreadystatechange.call(o)}Object.defineProperty(Xi.prototype,"withCredentials",{get:function(){return this.m==="include"},set:function(o){this.m=o?"include":"same-origin"}});function sd(o){let l="";return q(o,function(h,p){l+=p,l+=":",l+=h,l+=`\r
`}),l}function Oa(o,l,h){e:{for(p in h){var p=!1;break e}p=!0}p||(h=sd(h),typeof o=="string"?h!=null&&encodeURIComponent(String(h)):ee(o,l,h))}function ie(o){Ie.call(this),this.headers=new Map,this.o=o||null,this.h=!1,this.v=this.g=null,this.D="",this.m=0,this.l="",this.j=this.B=this.u=this.A=!1,this.I=null,this.H="",this.J=!1}k(ie,Ie);var H_=/^https?$/i,W_=["POST","PUT"];n=ie.prototype,n.Ha=function(o){this.J=o},n.ea=function(o,l,h,p){if(this.g)throw Error("[goog.net.XhrIo] Object is active with another request="+this.D+"; newUri="+o);l=l?l.toUpperCase():"GET",this.D=o,this.l="",this.m=0,this.A=!1,this.h=!0,this.g=this.o?this.o.g():Sa.g(),this.v=this.o?xh(this.o):xh(Sa),this.g.onreadystatechange=b(this.Ea,this);try{this.B=!0,this.g.open(l,String(o),!0),this.B=!1}catch(S){od(this,S);return}if(o=h||"",h=new Map(this.headers),p)if(Object.getPrototypeOf(p)===Object.prototype)for(var T in p)h.set(T,p[T]);else if(typeof p.keys=="function"&&typeof p.get=="function")for(let S of p.keys())h.set(S,p.get(S));else throw Error("Unknown input type for opt_headers: "+String(p));p=Array.from(h.keys()).find(S=>S.toLowerCase()=="content-type"),T=c.FormData&&o instanceof c.FormData,!(0<=Array.prototype.indexOf.call(W_,l,void 0))||p||T||h.set("Content-Type","application/x-www-form-urlencoded;charset=utf-8");for(let[S,C]of h)this.g.setRequestHeader(S,C);this.H&&(this.g.responseType=this.H),"withCredentials"in this.g&&this.g.withCredentials!==this.J&&(this.g.withCredentials=this.J);try{ud(this),this.u=!0,this.g.send(o),this.u=!1}catch(S){od(this,S)}};function od(o,l){o.h=!1,o.g&&(o.j=!0,o.g.abort(),o.j=!1),o.l=l,o.m=5,ad(o),Zi(o)}function ad(o){o.A||(o.A=!0,Re(o,"complete"),Re(o,"error"))}n.abort=function(o){this.g&&this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1,this.m=o||7,Re(this,"complete"),Re(this,"abort"),Zi(this))},n.N=function(){this.g&&(this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1),Zi(this,!0)),ie.aa.N.call(this)},n.Ea=function(){this.s||(this.B||this.u||this.j?cd(this):this.bb())},n.bb=function(){cd(this)};function cd(o){if(o.h&&typeof a<"u"&&(!o.v[1]||gt(o)!=4||o.Z()!=2)){if(o.u&&gt(o)==4)Ch(o.Ea,0,o);else if(Re(o,"readystatechange"),gt(o)==4){o.h=!1;try{let C=o.Z();e:switch(C){case 200:case 201:case 202:case 204:case 206:case 304:case 1223:var l=!0;break e;default:l=!1}var h;if(!(h=l)){var p;if(p=C===0){var T=String(o.D).match(Xh)[1]||null;!T&&c.self&&c.self.location&&(T=c.self.location.protocol.slice(0,-1)),p=!H_.test(T?T.toLowerCase():"")}h=p}if(h)Re(o,"complete"),Re(o,"success");else{o.m=6;try{var S=2<gt(o)?o.g.statusText:""}catch{S=""}o.l=S+" ["+o.Z()+"]",ad(o)}}finally{Zi(o)}}}}function Zi(o,l){if(o.g){ud(o);let h=o.g,p=o.v[0]?()=>{}:null;o.g=null,o.v=null,l||Re(o,"ready");try{h.onreadystatechange=p}catch{}}}function ud(o){o.I&&(c.clearTimeout(o.I),o.I=null)}n.isActive=function(){return!!this.g};function gt(o){return o.g?o.g.readyState:0}n.Z=function(){try{return 2<gt(this)?this.g.status:-1}catch{return-1}},n.oa=function(){try{return this.g?this.g.responseText:""}catch{return""}},n.Oa=function(o){if(this.g){var l=this.g.responseText;return o&&l.indexOf(o)==0&&(l=l.substring(o.length)),S_(l)}};function ld(o){try{if(!o.g)return null;if("response"in o.g)return o.g.response;switch(o.H){case"":case"text":return o.g.responseText;case"arraybuffer":if("mozResponseArrayBuffer"in o.g)return o.g.mozResponseArrayBuffer}return null}catch{return null}}function Q_(o){let l={};o=(o.g&&2<=gt(o)&&o.g.getAllResponseHeaders()||"").split(`\r
`);for(let p=0;p<o.length;p++){if(z(o[p]))continue;var h=I(o[p]);let T=h[0];if(h=h[1],typeof h!="string")continue;h=h.trim();let S=l[T]||[];l[T]=S,S.push(h)}w(l,function(p){return p.join(", ")})}n.Ba=function(){return this.m},n.Ka=function(){return typeof this.l=="string"?this.l:String(this.l)};function Mr(o,l,h){return h&&h.internalChannelParams&&h.internalChannelParams[o]||l}function hd(o){this.Aa=0,this.i=[],this.j=new kr,this.ia=this.qa=this.I=this.W=this.g=this.ya=this.D=this.H=this.m=this.S=this.o=null,this.Ya=this.U=0,this.Va=Mr("failFast",!1,o),this.F=this.C=this.u=this.s=this.l=null,this.X=!0,this.za=this.T=-1,this.Y=this.v=this.B=0,this.Ta=Mr("baseRetryDelayMs",5e3,o),this.cb=Mr("retryDelaySeedMs",1e4,o),this.Wa=Mr("forwardChannelMaxRetries",2,o),this.wa=Mr("forwardChannelRequestTimeoutMs",2e4,o),this.pa=o&&o.xmlHttpFactory||void 0,this.Xa=o&&o.Tb||void 0,this.Ca=o&&o.useFetchStreams||!1,this.L=void 0,this.J=o&&o.supportsCrossDomainXhr||!1,this.K="",this.h=new Gh(o&&o.concurrentRequestLimit),this.Da=new K_,this.P=o&&o.fastHandshake||!1,this.O=o&&o.encodeInitMessageHeaders||!1,this.P&&this.O&&(this.O=!1),this.Ua=o&&o.Rb||!1,o&&o.xa&&this.j.xa(),o&&o.forceLongPolling&&(this.X=!1),this.ba=!this.P&&this.X&&o&&o.detectBufferingProxy||!1,this.ja=void 0,o&&o.longPollingTimeout&&0<o.longPollingTimeout&&(this.ja=o.longPollingTimeout),this.ca=void 0,this.R=0,this.M=!1,this.ka=this.A=null}n=hd.prototype,n.la=8,n.G=1,n.connect=function(o,l,h,p){Pe(0),this.W=o,this.H=l||{},h&&p!==void 0&&(this.H.OSID=h,this.H.OAID=p),this.F=this.X,this.I=vd(this,null,this.W),ts(this)};function xa(o){if(dd(o),o.G==3){var l=o.U++,h=mt(o.I);if(ee(h,"SID",o.K),ee(h,"RID",l),ee(h,"TYPE","terminate"),Fr(o,h),l=new kt(o,o.j,l),l.L=2,l.v=Ji(mt(h)),h=!1,c.navigator&&c.navigator.sendBeacon)try{h=c.navigator.sendBeacon(l.v.toString(),"")}catch{}!h&&c.Image&&(new Image().src=l.v,h=!0),h||(l.g=Id(l.j,null),l.g.ea(l.v)),l.F=Date.now(),Wi(l)}wd(o)}function es(o){o.g&&(La(o),o.g.cancel(),o.g=null)}function dd(o){es(o),o.u&&(c.clearTimeout(o.u),o.u=null),ns(o),o.h.cancel(),o.s&&(typeof o.s=="number"&&c.clearTimeout(o.s),o.s=null)}function ts(o){if(!Hh(o.h)&&!o.s){o.s=!0;var l=o.Ga;Ir||bh(),Tr||(Ir(),Tr=!0),fa.add(l,o),o.B=0}}function Y_(o,l){return Wh(o.h)>=o.h.j-(o.s?1:0)?!1:o.s?(o.i=l.D.concat(o.i),!0):o.G==1||o.G==2||o.B>=(o.Va?0:o.Wa)?!1:(o.s=Pr(b(o.Ga,o,l),yd(o,o.B)),o.B++,!0)}n.Ga=function(o){if(this.s)if(this.s=null,this.G==1){if(!o){this.U=Math.floor(1e5*Math.random()),o=this.U++;let T=new kt(this,this.j,o),S=this.o;if(this.S&&(S?(S=m(S),v(S,this.S)):S=this.S),this.m!==null||this.O||(T.H=S,S=null),this.P)e:{for(var l=0,h=0;h<this.i.length;h++){t:{var p=this.i[h];if("__data__"in p.map&&(p=p.map.__data__,typeof p=="string")){p=p.length;break t}p=void 0}if(p===void 0)break;if(l+=p,4096<l){l=h;break e}if(l===4096||h===this.i.length-1){l=h+1;break e}}l=1e3}else l=1e3;l=pd(this,T,l),h=mt(this.I),ee(h,"RID",o),ee(h,"CVER",22),this.D&&ee(h,"X-HTTP-Session-Id",this.D),Fr(this,h),S&&(this.O?l="headers="+encodeURIComponent(String(sd(S)))+"&"+l:this.m&&Oa(h,this.m,S)),Na(this.h,T),this.Ua&&ee(h,"TYPE","init"),this.P?(ee(h,"$req",l),ee(h,"SID","null"),T.T=!0,Pa(T,h,null)):Pa(T,h,l),this.G=2}}else this.G==3&&(o?fd(this,o):this.i.length==0||Hh(this.h)||fd(this))};function fd(o,l){var h;l?h=l.l:h=o.U++;let p=mt(o.I);ee(p,"SID",o.K),ee(p,"RID",h),ee(p,"AID",o.T),Fr(o,p),o.m&&o.o&&Oa(p,o.m,o.o),h=new kt(o,o.j,h,o.B+1),o.m===null&&(h.H=o.o),l&&(o.i=l.D.concat(o.i)),l=pd(o,h,1e3),h.I=Math.round(.5*o.wa)+Math.round(.5*o.wa*Math.random()),Na(o.h,h),Pa(h,p,l)}function Fr(o,l){o.H&&q(o.H,function(h,p){ee(l,p,h)}),o.l&&Jh({},function(h,p){ee(l,p,h)})}function pd(o,l,h){h=Math.min(o.i.length,h);var p=o.l?b(o.l.Na,o.l,o):null;e:{var T=o.i;let S=-1;for(;;){let C=["count="+h];S==-1?0<h?(S=T[0].g,C.push("ofs="+S)):S=0:C.push("ofs="+S);let X=!0;for(let _e=0;_e<h;_e++){let W=T[_e].g,Te=T[_e].map;if(W-=S,0>W)S=Math.max(0,T[_e].g-100),X=!1;else try{G_(Te,C,"req"+W+"_")}catch{p&&p(Te)}}if(X){p=C.join("&");break e}}}return o=o.i.splice(0,h),l.D=o,p}function md(o){if(!o.g&&!o.u){o.Y=1;var l=o.Fa;Ir||bh(),Tr||(Ir(),Tr=!0),fa.add(l,o),o.v=0}}function Va(o){return o.g||o.u||3<=o.v?!1:(o.Y++,o.u=Pr(b(o.Fa,o),yd(o,o.v)),o.v++,!0)}n.Fa=function(){if(this.u=null,gd(this),this.ba&&!(this.M||this.g==null||0>=this.R)){var o=2*this.R;this.j.info("BP detection timer enabled: "+o),this.A=Pr(b(this.ab,this),o)}},n.ab=function(){this.A&&(this.A=null,this.j.info("BP detection timeout reached."),this.j.info("Buffering proxy detected and switch to long-polling!"),this.F=!1,this.M=!0,Pe(10),es(this),gd(this))};function La(o){o.A!=null&&(c.clearTimeout(o.A),o.A=null)}function gd(o){o.g=new kt(o,o.j,"rpc",o.Y),o.m===null&&(o.g.H=o.o),o.g.O=0;var l=mt(o.qa);ee(l,"RID","rpc"),ee(l,"SID",o.K),ee(l,"AID",o.T),ee(l,"CI",o.F?"0":"1"),!o.F&&o.ja&&ee(l,"TO",o.ja),ee(l,"TYPE","xmlhttp"),Fr(o,l),o.m&&o.o&&Oa(l,o.m,o.o),o.L&&(o.g.I=o.L);var h=o.g;o=o.ia,h.L=1,h.v=Ji(mt(l)),h.m=null,h.P=!0,zh(h,o)}n.Za=function(){this.C!=null&&(this.C=null,es(this),Va(this),Pe(19))};function ns(o){o.C!=null&&(c.clearTimeout(o.C),o.C=null)}function _d(o,l){var h=null;if(o.g==l){ns(o),La(o),o.g=null;var p=2}else if(Da(o.h,l))h=l.D,Qh(o.h,l),p=1;else return;if(o.G!=0){if(l.o)if(p==1){h=l.m?l.m.length:0,l=Date.now()-l.F;var T=o.B;p=Ki(),Re(p,new Uh(p,h)),ts(o)}else md(o);else if(T=l.s,T==3||T==0&&0<l.X||!(p==1&&Y_(o,l)||p==2&&Va(o)))switch(h&&0<h.length&&(l=o.h,l.i=l.i.concat(h)),T){case 1:Xt(o,5);break;case 4:Xt(o,10);break;case 3:Xt(o,6);break;default:Xt(o,2)}}}function yd(o,l){let h=o.Ta+Math.floor(Math.random()*o.cb);return o.isActive()||(h*=2),h*l}function Xt(o,l){if(o.j.info("Error code "+l),l==2){var h=b(o.fb,o),p=o.Xa;let T=!p;p=new Jt(p||"//www.google.com/images/cleardot.gif"),c.location&&c.location.protocol=="http"||Qi(p,"https"),Ji(p),T?z_(p.toString(),h):$_(p.toString(),h)}else Pe(2);o.G=0,o.l&&o.l.sa(l),wd(o),dd(o)}n.fb=function(o){o?(this.j.info("Successfully pinged google.com"),Pe(2)):(this.j.info("Failed to ping google.com"),Pe(1))};function wd(o){if(o.G=0,o.ka=[],o.l){let l=Yh(o.h);(l.length!=0||o.i.length!=0)&&(N(o.ka,l),N(o.ka,o.i),o.h.i.length=0,O(o.i),o.i.length=0),o.l.ra()}}function vd(o,l,h){var p=h instanceof Jt?mt(h):new Jt(h);if(p.g!="")l&&(p.g=l+"."+p.g),Yi(p,p.s);else{var T=c.location;p=T.protocol,l=l?l+"."+T.hostname:T.hostname,T=+T.port;var S=new Jt(null);p&&Qi(S,p),l&&(S.g=l),T&&Yi(S,T),h&&(S.l=h),p=S}return h=o.D,l=o.ya,h&&l&&ee(p,h,l),ee(p,"VER",o.la),Fr(o,p),p}function Id(o,l,h){if(l&&!o.J)throw Error("Can't create secondary domain capable XhrIo object.");return l=o.Ca&&!o.pa?new ie(new xr({eb:h})):new ie(o.pa),l.Ha(o.J),l}n.isActive=function(){return!!this.l&&this.l.isActive(this)};function Td(){}n=Td.prototype,n.ua=function(){},n.ta=function(){},n.sa=function(){},n.ra=function(){},n.isActive=function(){return!0},n.Na=function(){};function rs(){}rs.prototype.g=function(o,l){return new xe(o,l)};function xe(o,l){Ie.call(this),this.g=new hd(l),this.l=o,this.h=l&&l.messageUrlParams||null,o=l&&l.messageHeaders||null,l&&l.clientProtocolHeaderRequired&&(o?o["X-Client-Protocol"]="webchannel":o={"X-Client-Protocol":"webchannel"}),this.g.o=o,o=l&&l.initMessageHeaders||null,l&&l.messageContentType&&(o?o["X-WebChannel-Content-Type"]=l.messageContentType:o={"X-WebChannel-Content-Type":l.messageContentType}),l&&l.va&&(o?o["X-WebChannel-Client-Profile"]=l.va:o={"X-WebChannel-Client-Profile":l.va}),this.g.S=o,(o=l&&l.Sb)&&!z(o)&&(this.g.m=o),this.v=l&&l.supportsCrossDomainXhr||!1,this.u=l&&l.sendRawJson||!1,(l=l&&l.httpSessionIdParam)&&!z(l)&&(this.g.D=l,o=this.h,o!==null&&l in o&&(o=this.h,l in o&&delete o[l])),this.j=new On(this)}k(xe,Ie),xe.prototype.m=function(){this.g.l=this.j,this.v&&(this.g.J=!0),this.g.connect(this.l,this.h||void 0)},xe.prototype.close=function(){xa(this.g)},xe.prototype.o=function(o){var l=this.g;if(typeof o=="string"){var h={};h.__data__=o,o=h}else this.u&&(h={},h.__data__=Ta(o),o=h);l.i.push(new O_(l.Ya++,o)),l.G==3&&ts(l)},xe.prototype.N=function(){this.g.l=null,delete this.j,xa(this.g),delete this.g,xe.aa.N.call(this)};function Ed(o){ba.call(this),o.__headers__&&(this.headers=o.__headers__,this.statusCode=o.__status__,delete o.__headers__,delete o.__status__);var l=o.__sm__;if(l){e:{for(let h in l){o=h;break e}o=void 0}(this.i=o)&&(o=this.i,l=l!==null&&o in l?l[o]:void 0),this.data=l}else this.data=o}k(Ed,ba);function bd(){Aa.call(this),this.status=1}k(bd,Aa);function On(o){this.g=o}k(On,Td),On.prototype.ua=function(){Re(this.g,"a")},On.prototype.ta=function(o){Re(this.g,new Ed(o))},On.prototype.sa=function(o){Re(this.g,new bd)},On.prototype.ra=function(){Re(this.g,"b")},rs.prototype.createWebChannel=rs.prototype.g,xe.prototype.send=xe.prototype.o,xe.prototype.open=xe.prototype.m,xe.prototype.close=xe.prototype.close,nu=Tt.createWebChannelTransport=function(){return new rs},tu=Tt.getStatEventTarget=function(){return Ki()},eu=Tt.Event=Qt,no=Tt.Stat={mb:0,pb:1,qb:2,Jb:3,Ob:4,Lb:5,Mb:6,Kb:7,Ib:8,Nb:9,PROXY:10,NOPROXY:11,Gb:12,Cb:13,Db:14,Bb:15,Eb:16,Fb:17,ib:18,hb:19,jb:20},Gi.NO_ERROR=0,Gi.TIMEOUT=8,Gi.HTTP_ERROR=6,ci=Tt.ErrorCode=Gi,Bh.COMPLETE="complete",Zc=Tt.EventType=Bh,Vh.EventType=Sr,Sr.OPEN="a",Sr.CLOSE="b",Sr.ERROR="c",Sr.MESSAGE="d",Ie.prototype.listen=Ie.prototype.K,jn=Tt.WebChannel=Vh,FT=Tt.FetchXmlHttpFactory=xr,ie.prototype.listenOnce=ie.prototype.L,ie.prototype.getLastError=ie.prototype.Ka,ie.prototype.getLastErrorCode=ie.prototype.Ba,ie.prototype.getStatus=ie.prototype.Z,ie.prototype.getResponseJson=ie.prototype.Oa,ie.prototype.getResponseText=ie.prototype.oa,ie.prototype.send=ie.prototype.ea,ie.prototype.setWithCredentials=ie.prototype.Ha,Xc=Tt.XhrIo=ie}).apply(typeof to<"u"?to:typeof self<"u"?self:typeof window<"u"?window:{});var Tp="@firebase/firestore",Ep="4.7.8";var ge=class{constructor(e){this.uid=e}isAuthenticated(){return this.uid!=null}toKey(){return this.isAuthenticated()?"uid:"+this.uid:"anonymous-user"}isEqual(e){return e.uid===this.uid}};ge.UNAUTHENTICATED=new ge(null),ge.GOOGLE_CREDENTIALS=new ge("google-credentials-uid"),ge.FIRST_PARTY=new ge("first-party-uid"),ge.MOCK_USER=new ge("mock-user");var _r="11.3.1";var bn=new Ze("@firebase/firestore");function Qn(){return bn.logLevel}function D(n,...e){if(bn.logLevel<=j.DEBUG){let t=e.map(ql);bn.debug(`Firestore (${_r}): ${n}`,...t)}}function je(n,...e){if(bn.logLevel<=j.ERROR){let t=e.map(ql);bn.error(`Firestore (${_r}): ${n}`,...t)}}function Bl(n,...e){if(bn.logLevel<=j.WARN){let t=e.map(ql);bn.warn(`Firestore (${_r}): ${n}`,...t)}}function ql(n){if(typeof n=="string")return n;try{return function(t){return JSON.stringify(t)}(n)}catch{return n}}function F(n="Unexpected state"){let e=`FIRESTORE (${_r}) INTERNAL ASSERTION FAILED: `+n;throw je(e),new Error(e)}function U(n,e){n||F()}function ne(n,e){return n}var P={OK:"ok",CANCELLED:"cancelled",UNKNOWN:"unknown",INVALID_ARGUMENT:"invalid-argument",DEADLINE_EXCEEDED:"deadline-exceeded",NOT_FOUND:"not-found",ALREADY_EXISTS:"already-exists",PERMISSION_DENIED:"permission-denied",UNAUTHENTICATED:"unauthenticated",RESOURCE_EXHAUSTED:"resource-exhausted",FAILED_PRECONDITION:"failed-precondition",ABORTED:"aborted",OUT_OF_RANGE:"out-of-range",UNIMPLEMENTED:"unimplemented",INTERNAL:"internal",UNAVAILABLE:"unavailable",DATA_LOSS:"data-loss"},M=class extends he{constructor(e,t){super(e,t),this.code=e,this.message=t,this.toString=()=>`${this.name}: [code=${this.code}]: ${this.message}`}};var qt=class{constructor(){this.promise=new Promise((e,t)=>{this.resolve=e,this.reject=t})}};var mo=class{constructor(e,t){this.user=t,this.type="OAuth",this.headers=new Map,this.headers.set("Authorization",`Bearer ${e}`)}},uu=class{getToken(){return Promise.resolve(null)}invalidateToken(){}start(e,t){e.enqueueRetryable(()=>t(ge.UNAUTHENTICATED))}shutdown(){}},lu=class{constructor(e){this.token=e,this.changeListener=null}getToken(){return Promise.resolve(this.token)}invalidateToken(){}start(e,t){this.changeListener=t,e.enqueueRetryable(()=>t(this.token.user))}shutdown(){this.changeListener=null}},hu=class{constructor(e){this.t=e,this.currentUser=ge.UNAUTHENTICATED,this.i=0,this.forceRefresh=!1,this.auth=null}start(e,t){U(this.o===void 0);let r=this.i,i=u=>this.i!==r?(r=this.i,t(u)):Promise.resolve(),s=new qt;this.o=()=>{this.i++,this.currentUser=this.u(),s.resolve(),s=new qt,e.enqueueRetryable(()=>i(this.currentUser))};let a=()=>{let u=s;e.enqueueRetryable(async()=>{await u.promise,await i(this.currentUser)})},c=u=>{D("FirebaseAuthCredentialsProvider","Auth detected"),this.auth=u,this.o&&(this.auth.addAuthTokenListener(this.o),a())};this.t.onInit(u=>c(u)),setTimeout(()=>{if(!this.auth){let u=this.t.getImmediate({optional:!0});u?c(u):(D("FirebaseAuthCredentialsProvider","Auth not yet detected"),s.resolve(),s=new qt)}},0),a()}getToken(){let e=this.i,t=this.forceRefresh;return this.forceRefresh=!1,this.auth?this.auth.getToken(t).then(r=>this.i!==e?(D("FirebaseAuthCredentialsProvider","getToken aborted due to token change."),this.getToken()):r?(U(typeof r.accessToken=="string"),new mo(r.accessToken,this.currentUser)):null):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.auth&&this.o&&this.auth.removeAuthTokenListener(this.o),this.o=void 0}u(){let e=this.auth&&this.auth.getUid();return U(e===null||typeof e=="string"),new ge(e)}},du=class{constructor(e,t,r){this.l=e,this.h=t,this.P=r,this.type="FirstParty",this.user=ge.FIRST_PARTY,this.T=new Map}I(){return this.P?this.P():null}get headers(){this.T.set("X-Goog-AuthUser",this.l);let e=this.I();return e&&this.T.set("Authorization",e),this.h&&this.T.set("X-Goog-Iam-Authorization-Token",this.h),this.T}},fu=class{constructor(e,t,r){this.l=e,this.h=t,this.P=r}getToken(){return Promise.resolve(new du(this.l,this.h,this.P))}start(e,t){e.enqueueRetryable(()=>t(ge.FIRST_PARTY))}shutdown(){}invalidateToken(){}},go=class{constructor(e){this.value=e,this.type="AppCheck",this.headers=new Map,e&&e.length>0&&this.headers.set("x-firebase-appcheck",this.value)}},pu=class{constructor(e,t){this.A=t,this.forceRefresh=!1,this.appCheck=null,this.R=null,this.V=null,Ne(e)&&e.settings.appCheckToken&&(this.V=e.settings.appCheckToken)}start(e,t){U(this.o===void 0);let r=s=>{s.error!=null&&D("FirebaseAppCheckTokenProvider",`Error getting App Check token; using placeholder token instead. Error: ${s.error.message}`);let a=s.token!==this.R;return this.R=s.token,D("FirebaseAppCheckTokenProvider",`Received ${a?"new":"existing"} token.`),a?t(s.token):Promise.resolve()};this.o=s=>{e.enqueueRetryable(()=>r(s))};let i=s=>{D("FirebaseAppCheckTokenProvider","AppCheck detected"),this.appCheck=s,this.o&&this.appCheck.addTokenListener(this.o)};this.A.onInit(s=>i(s)),setTimeout(()=>{if(!this.appCheck){let s=this.A.getImmediate({optional:!0});s?i(s):D("FirebaseAppCheckTokenProvider","AppCheck not yet detected")}},0)}getToken(){if(this.V)return Promise.resolve(new go(this.V));let e=this.forceRefresh;return this.forceRefresh=!1,this.appCheck?this.appCheck.getToken(e).then(t=>t?(U(typeof t.token=="string"),this.R=t.token,new go(t.token)):null):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.appCheck&&this.o&&this.appCheck.removeTokenListener(this.o),this.o=void 0}};function $(n,e){return n<e?-1:n>e?1:0}function tr(n,e,t){return n.length===e.length&&n.every((r,i)=>t(r,e[i]))}function Tm(n){return n+"\0"}var bp=-62135596800,Ap=1e6,ke=class n{static now(){return n.fromMillis(Date.now())}static fromDate(e){return n.fromMillis(e.getTime())}static fromMillis(e){let t=Math.floor(e/1e3),r=Math.floor((e-1e3*t)*Ap);return new n(t,r)}constructor(e,t){if(this.seconds=e,this.nanoseconds=t,t<0)throw new M(P.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+t);if(t>=1e9)throw new M(P.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+t);if(e<bp)throw new M(P.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e);if(e>=253402300800)throw new M(P.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e)}toDate(){return new Date(this.toMillis())}toMillis(){return 1e3*this.seconds+this.nanoseconds/Ap}_compareTo(e){return this.seconds===e.seconds?$(this.nanoseconds,e.nanoseconds):$(this.seconds,e.seconds)}isEqual(e){return e.seconds===this.seconds&&e.nanoseconds===this.nanoseconds}toString(){return"Timestamp(seconds="+this.seconds+", nanoseconds="+this.nanoseconds+")"}toJSON(){return{seconds:this.seconds,nanoseconds:this.nanoseconds}}valueOf(){let e=this.seconds-bp;return String(e).padStart(12,"0")+"."+String(this.nanoseconds).padStart(9,"0")}};var Q=class n{static fromTimestamp(e){return new n(e)}static min(){return new n(new ke(0,0))}static max(){return new n(new ke(253402300799,999999999))}constructor(e){this.timestamp=e}compareTo(e){return this.timestamp._compareTo(e.timestamp)}isEqual(e){return this.timestamp.isEqual(e.timestamp)}toMicroseconds(){return 1e6*this.timestamp.seconds+this.timestamp.nanoseconds/1e3}toString(){return"SnapshotVersion("+this.timestamp.toString()+")"}toTimestamp(){return this.timestamp}};var Sp="__name__",_o=class n{constructor(e,t,r){t===void 0?t=0:t>e.length&&F(),r===void 0?r=e.length-t:r>e.length-t&&F(),this.segments=e,this.offset=t,this.len=r}get length(){return this.len}isEqual(e){return n.comparator(this,e)===0}child(e){let t=this.segments.slice(this.offset,this.limit());return e instanceof n?e.forEach(r=>{t.push(r)}):t.push(e),this.construct(t)}limit(){return this.offset+this.length}popFirst(e){return e=e===void 0?1:e,this.construct(this.segments,this.offset+e,this.length-e)}popLast(){return this.construct(this.segments,this.offset,this.length-1)}firstSegment(){return this.segments[this.offset]}lastSegment(){return this.get(this.length-1)}get(e){return this.segments[this.offset+e]}isEmpty(){return this.length===0}isPrefixOf(e){if(e.length<this.length)return!1;for(let t=0;t<this.length;t++)if(this.get(t)!==e.get(t))return!1;return!0}isImmediateParentOf(e){if(this.length+1!==e.length)return!1;for(let t=0;t<this.length;t++)if(this.get(t)!==e.get(t))return!1;return!0}forEach(e){for(let t=this.offset,r=this.limit();t<r;t++)e(this.segments[t])}toArray(){return this.segments.slice(this.offset,this.limit())}static comparator(e,t){let r=Math.min(e.length,t.length);for(let i=0;i<r;i++){let s=n.compareSegments(e.get(i),t.get(i));if(s!==0)return s}return Math.sign(e.length-t.length)}static compareSegments(e,t){let r=n.isNumericId(e),i=n.isNumericId(t);return r&&!i?-1:!r&&i?1:r&&i?n.extractNumericId(e).compare(n.extractNumericId(t)):e<t?-1:e>t?1:0}static isNumericId(e){return e.startsWith("__id")&&e.endsWith("__")}static extractNumericId(e){return eo.fromString(e.substring(4,e.length-2))}},ae=class n extends _o{construct(e,t,r){return new n(e,t,r)}canonicalString(){return this.toArray().join("/")}toString(){return this.canonicalString()}toUriEncodedString(){return this.toArray().map(encodeURIComponent).join("/")}static fromString(...e){let t=[];for(let r of e){if(r.indexOf("//")>=0)throw new M(P.INVALID_ARGUMENT,`Invalid segment (${r}). Paths must not contain // in them.`);t.push(...r.split("/").filter(i=>i.length>0))}return new n(t)}static emptyPath(){return new n([])}},UT=/^[_a-zA-Z][_a-zA-Z0-9]*$/,Se=class n extends _o{construct(e,t,r){return new n(e,t,r)}static isValidIdentifier(e){return UT.test(e)}canonicalString(){return this.toArray().map(e=>(e=e.replace(/\\/g,"\\\\").replace(/`/g,"\\`"),n.isValidIdentifier(e)||(e="`"+e+"`"),e)).join(".")}toString(){return this.canonicalString()}isKeyField(){return this.length===1&&this.get(0)===Sp}static keyField(){return new n([Sp])}static fromServerFormat(e){let t=[],r="",i=0,s=()=>{if(r.length===0)throw new M(P.INVALID_ARGUMENT,`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`);t.push(r),r=""},a=!1;for(;i<e.length;){let c=e[i];if(c==="\\"){if(i+1===e.length)throw new M(P.INVALID_ARGUMENT,"Path has trailing escape character: "+e);let u=e[i+1];if(u!=="\\"&&u!=="."&&u!=="`")throw new M(P.INVALID_ARGUMENT,"Path has invalid escape sequence: "+e);r+=u,i+=2}else c==="`"?(a=!a,i++):c!=="."||a?(r+=c,i++):(s(),i++)}if(s(),a)throw new M(P.INVALID_ARGUMENT,"Unterminated ` in path: "+e);return new n(t)}static emptyPath(){return new n([])}};var V=class n{constructor(e){this.path=e}static fromPath(e){return new n(ae.fromString(e))}static fromName(e){return new n(ae.fromString(e).popFirst(5))}static empty(){return new n(ae.emptyPath())}get collectionGroup(){return this.path.popLast().lastSegment()}hasCollectionId(e){return this.path.length>=2&&this.path.get(this.path.length-2)===e}getCollectionGroup(){return this.path.get(this.path.length-2)}getCollectionPath(){return this.path.popLast()}isEqual(e){return e!==null&&ae.comparator(this.path,e.path)===0}toString(){return this.path.toString()}static comparator(e,t){return ae.comparator(e.path,t.path)}static isDocumentKey(e){return e.length%2==0}static fromSegments(e){return new n(new ae(e.slice()))}};var vi=-1,nr=class{constructor(e,t,r,i){this.indexId=e,this.collectionGroup=t,this.fields=r,this.indexState=i}};function mu(n){return n.fields.find(e=>e.kind===2)}function fn(n){return n.fields.filter(e=>e.kind!==2)}nr.UNKNOWN_ID=-1;var er=class{constructor(e,t){this.fieldPath=e,this.kind=t}};var Ii=class n{constructor(e,t){this.sequenceNumber=e,this.offset=t}static empty(){return new n(0,$e.min())}};function BT(n,e){let t=n.toTimestamp().seconds,r=n.toTimestamp().nanoseconds+1,i=Q.fromTimestamp(r===1e9?new ke(t+1,0):new ke(t,r));return new $e(i,V.empty(),e)}function Em(n){return new $e(n.readTime,n.key,vi)}var $e=class n{constructor(e,t,r){this.readTime=e,this.documentKey=t,this.largestBatchId=r}static min(){return new n(Q.min(),V.empty(),vi)}static max(){return new n(Q.max(),V.empty(),vi)}};function jl(n,e){let t=n.readTime.compareTo(e.readTime);return t!==0?t:(t=V.comparator(n.documentKey,e.documentKey),t!==0?t:$(n.largestBatchId,e.largestBatchId))}var bm="The current tab is not in the required state to perform this operation. It might be necessary to refresh the browser tab.",yo=class{constructor(){this.onCommittedListeners=[]}addOnCommittedListener(e){this.onCommittedListeners.push(e)}raiseOnCommittedEvent(){this.onCommittedListeners.forEach(e=>e())}};async function ea(n){if(n.code!==P.FAILED_PRECONDITION||n.message!==bm)throw n;D("LocalStore","Unexpectedly lost primary lease")}var A=class n{constructor(e){this.nextCallback=null,this.catchCallback=null,this.result=void 0,this.error=void 0,this.isDone=!1,this.callbackAttached=!1,e(t=>{this.isDone=!0,this.result=t,this.nextCallback&&this.nextCallback(t)},t=>{this.isDone=!0,this.error=t,this.catchCallback&&this.catchCallback(t)})}catch(e){return this.next(void 0,e)}next(e,t){return this.callbackAttached&&F(),this.callbackAttached=!0,this.isDone?this.error?this.wrapFailure(t,this.error):this.wrapSuccess(e,this.result):new n((r,i)=>{this.nextCallback=s=>{this.wrapSuccess(e,s).next(r,i)},this.catchCallback=s=>{this.wrapFailure(t,s).next(r,i)}})}toPromise(){return new Promise((e,t)=>{this.next(e,t)})}wrapUserFunction(e){try{let t=e();return t instanceof n?t:n.resolve(t)}catch(t){return n.reject(t)}}wrapSuccess(e,t){return e?this.wrapUserFunction(()=>e(t)):n.resolve(t)}wrapFailure(e,t){return e?this.wrapUserFunction(()=>e(t)):n.reject(t)}static resolve(e){return new n((t,r)=>{t(e)})}static reject(e){return new n((t,r)=>{r(e)})}static waitFor(e){return new n((t,r)=>{let i=0,s=0,a=!1;e.forEach(c=>{++i,c.next(()=>{++s,a&&s===i&&t()},u=>r(u))}),a=!0,s===i&&t()})}static or(e){let t=n.resolve(!1);for(let r of e)t=t.next(i=>i?n.resolve(i):r());return t}static forEach(e,t){let r=[];return e.forEach((i,s)=>{r.push(t.call(this,i,s))}),this.waitFor(r)}static mapArray(e,t){return new n((r,i)=>{let s=e.length,a=new Array(s),c=0;for(let u=0;u<s;u++){let d=u;t(e[d]).next(f=>{a[d]=f,++c,c===s&&r(a)},f=>i(f))}})}static doWhile(e,t){return new n((r,i)=>{let s=()=>{e()===!0?t().next(()=>{s()},i):r()};s()})}};var Le="SimpleDb",wo=class n{static open(e,t,r,i){try{return new n(t,e.transaction(i,r))}catch(s){throw new In(t,s)}}constructor(e,t){this.action=e,this.transaction=t,this.aborted=!1,this.m=new qt,this.transaction.oncomplete=()=>{this.m.resolve()},this.transaction.onabort=()=>{t.error?this.m.reject(new In(e,t.error)):this.m.resolve()},this.transaction.onerror=r=>{let i=zl(r.target.error);this.m.reject(new In(e,i))}}get p(){return this.m.promise}abort(e){e&&this.m.reject(e),this.aborted||(D(Le,"Aborting transaction:",e?e.message:"Client-initiated abort"),this.aborted=!0,this.transaction.abort())}S(){let e=this.transaction;this.aborted||typeof e.commit!="function"||e.commit()}store(e){let t=this.transaction.objectStore(e);return new _u(t)}},rr=class n{static delete(e){return D(Le,"Removing database:",e),mn(window.indexedDB.deleteDatabase(e)).toPromise()}static D(){if(!Ge())return!1;if(n.v())return!0;let e=se(),t=n.C(e),r=0<t&&t<10,i=Am(e),s=0<i&&i<4.5;return!(e.indexOf("MSIE ")>0||e.indexOf("Trident/")>0||e.indexOf("Edge/")>0||r||s)}static v(){var e;return typeof process<"u"&&((e=process.__PRIVATE_env)===null||e===void 0?void 0:e.F)==="YES"}static M(e,t){return e.store(t)}static C(e){let t=e.match(/i(?:phone|pad|pod) os ([\d_]+)/i),r=t?t[1].split("_").slice(0,2).join("."):"-1";return Number(r)}constructor(e,t,r){this.name=e,this.version=t,this.O=r,n.C(se())===12.2&&je("Firestore persistence suffers from a bug in iOS 12.2 Safari that may cause your app to stop working. See https://stackoverflow.com/q/56496296/110915 for details and a potential workaround.")}async N(e){return this.db||(D(Le,"Opening database:",this.name),this.db=await new Promise((t,r)=>{let i=indexedDB.open(this.name,this.version);i.onsuccess=s=>{let a=s.target.result;t(a)},i.onblocked=()=>{r(new In(e,"Cannot upgrade IndexedDB schema while another tab is open. Close all tabs that access Firestore and reload this page to proceed."))},i.onerror=s=>{let a=s.target.error;a.name==="VersionError"?r(new M(P.FAILED_PRECONDITION,"A newer version of the Firestore SDK was previously used and so the persisted data is not compatible with the version of the SDK you are now using. The SDK will operate with persistence disabled. If you need persistence, please re-upgrade to a newer version of the SDK or else clear the persisted IndexedDB data for your app to start fresh.")):a.name==="InvalidStateError"?r(new M(P.FAILED_PRECONDITION,"Unable to open an IndexedDB connection. This could be due to running in a private browsing session on a browser whose private browsing sessions do not support IndexedDB: "+a)):r(new In(e,a))},i.onupgradeneeded=s=>{D(Le,'Database "'+this.name+'" requires upgrade from version:',s.oldVersion);let a=s.target.result;this.O.B(a,i.transaction,s.oldVersion,this.version).next(()=>{D(Le,"Database upgrade to version "+this.version+" complete")})}})),this.L&&(this.db.onversionchange=t=>this.L(t)),this.db}k(e){this.L=e,this.db&&(this.db.onversionchange=t=>e(t))}async runTransaction(e,t,r,i){let s=t==="readonly",a=0;for(;;){++a;try{this.db=await this.N(e);let c=wo.open(this.db,e,s?"readonly":"readwrite",r),u=i(c).next(d=>(c.S(),d)).catch(d=>(c.abort(d),A.reject(d))).toPromise();return u.catch(()=>{}),await c.p,u}catch(c){let u=c,d=u.name!=="FirebaseError"&&a<3;if(D(Le,"Transaction failed with error:",u.message,"Retrying:",d),this.close(),!d)return Promise.reject(u)}}}close(){this.db&&this.db.close(),this.db=void 0}};function Am(n){let e=n.match(/Android ([\d.]+)/i),t=e?e[1].split(".").slice(0,2).join("."):"-1";return Number(t)}var gu=class{constructor(e){this.q=e,this.$=!1,this.K=null}get isDone(){return this.$}get U(){return this.K}set cursor(e){this.q=e}done(){this.$=!0}W(e){this.K=e}delete(){return mn(this.q.delete())}},In=class extends M{constructor(e,t){super(P.UNAVAILABLE,`IndexedDB transaction '${e}' failed: ${t}`),this.name="IndexedDbTransactionError"}};function yr(n){return n.name==="IndexedDbTransactionError"}var _u=class{constructor(e){this.store=e}put(e,t){let r;return t!==void 0?(D(Le,"PUT",this.store.name,e,t),r=this.store.put(t,e)):(D(Le,"PUT",this.store.name,"<auto-key>",e),r=this.store.put(e)),mn(r)}add(e){return D(Le,"ADD",this.store.name,e,e),mn(this.store.add(e))}get(e){return mn(this.store.get(e)).next(t=>(t===void 0&&(t=null),D(Le,"GET",this.store.name,e,t),t))}delete(e){return D(Le,"DELETE",this.store.name,e),mn(this.store.delete(e))}count(){return D(Le,"COUNT",this.store.name),mn(this.store.count())}G(e,t){let r=this.options(e,t),i=r.index?this.store.index(r.index):this.store;if(typeof i.getAll=="function"){let s=i.getAll(r.range);return new A((a,c)=>{s.onerror=u=>{c(u.target.error)},s.onsuccess=u=>{a(u.target.result)}})}{let s=this.cursor(r),a=[];return this.j(s,(c,u)=>{a.push(u)}).next(()=>a)}}H(e,t){let r=this.store.getAll(e,t===null?void 0:t);return new A((i,s)=>{r.onerror=a=>{s(a.target.error)},r.onsuccess=a=>{i(a.target.result)}})}J(e,t){D(Le,"DELETE ALL",this.store.name);let r=this.options(e,t);r.Y=!1;let i=this.cursor(r);return this.j(i,(s,a,c)=>c.delete())}Z(e,t){let r;t?r=e:(r={},t=e);let i=this.cursor(r);return this.j(i,t)}X(e){let t=this.cursor({});return new A((r,i)=>{t.onerror=s=>{let a=zl(s.target.error);i(a)},t.onsuccess=s=>{let a=s.target.result;a?e(a.primaryKey,a.value).next(c=>{c?a.continue():r()}):r()}})}j(e,t){let r=[];return new A((i,s)=>{e.onerror=a=>{s(a.target.error)},e.onsuccess=a=>{let c=a.target.result;if(!c)return void i();let u=new gu(c),d=t(c.primaryKey,c.value,u);if(d instanceof A){let f=d.catch(g=>(u.done(),A.reject(g)));r.push(f)}u.isDone?i():u.U===null?c.continue():c.continue(u.U)}}).next(()=>A.waitFor(r))}options(e,t){let r;return e!==void 0&&(typeof e=="string"?r=e:t=e),{index:r,range:t}}cursor(e){let t="next";if(e.reverse&&(t="prev"),e.index){let r=this.store.index(e.index);return e.Y?r.openKeyCursor(e.range,t):r.openCursor(e.range,t)}return this.store.openCursor(e.range,t)}};function mn(n){return new A((e,t)=>{n.onsuccess=r=>{let i=r.target.result;e(i)},n.onerror=r=>{let i=zl(r.target.error);t(i)}})}var Rp=!1;function zl(n){let e=rr.C(se());if(e>=12.2&&e<13){let t="An internal error was encountered in the Indexed Database server";if(n.message.indexOf(t)>=0){let r=new M("internal",`IOS_INDEXEDDB_BUG1: IndexedDb has thrown '${t}'. This is likely due to an unavoidable bug in iOS. See https://stackoverflow.com/q/56496296/110915 for details and a potential workaround.`);return Rp||(Rp=!0,setTimeout(()=>{throw r},0)),r}}return n}var mi="IndexBackfiller",yu=class{constructor(e,t){this.asyncQueue=e,this.ee=t,this.task=null}start(){this.te(15e3)}stop(){this.task&&(this.task.cancel(),this.task=null)}get started(){return this.task!==null}te(e){D(mi,`Scheduled in ${e}ms`),this.task=this.asyncQueue.enqueueAfterDelay("index_backfill",e,async()=>{this.task=null;try{let t=await this.ee.ne();D(mi,`Documents written: ${t}`)}catch(t){yr(t)?D(mi,"Ignoring IndexedDB error during index backfill: ",t):await ea(t)}await this.te(6e4)})}},wu=class{constructor(e,t){this.localStore=e,this.persistence=t}async ne(e=50){return this.persistence.runTransaction("Backfill Indexes","readwrite-primary",t=>this.re(t,e))}re(e,t){let r=new Set,i=t,s=!0;return A.doWhile(()=>s===!0&&i>0,()=>this.localStore.indexManager.getNextCollectionGroupToUpdate(e).next(a=>{if(a!==null&&!r.has(a))return D(mi,`Processing collection: ${a}`),this.ie(e,a,i).next(c=>{i-=c,r.add(a)});s=!1})).next(()=>t-i)}ie(e,t,r){return this.localStore.indexManager.getMinOffsetFromCollectionGroup(e,t).next(i=>this.localStore.localDocuments.getNextDocuments(e,t,i,r).next(s=>{let a=s.changes;return this.localStore.indexManager.updateIndexEntries(e,a).next(()=>this.se(i,s)).next(c=>(D(mi,`Updating offset: ${c}`),this.localStore.indexManager.updateCollectionGroup(e,t,c))).next(()=>a.size)}))}se(e,t){let r=e;return t.changes.forEach((i,s)=>{let a=Em(s);jl(a,r)>0&&(r=a)}),new $e(r.readTime,r.documentKey,Math.max(t.batchId,e.largestBatchId))}};var Me=class{constructor(e,t){this.previousValue=e,t&&(t.sequenceNumberHandler=r=>this.oe(r),this._e=r=>t.writeSequenceNumber(r))}oe(e){return this.previousValue=Math.max(e,this.previousValue),this.previousValue}next(){let e=++this.previousValue;return this._e&&this._e(e),e}};Me.ae=-1;var Tn=-1;function ta(n){return n==null}function vo(n){return n===0&&1/n==-1/0}var Io="";function Ce(n){let e="";for(let t=0;t<n.length;t++)e.length>0&&(e=Pp(e)),e=qT(n.get(t),e);return Pp(e)}function qT(n,e){let t=e,r=n.length;for(let i=0;i<r;i++){let s=n.charAt(i);switch(s){case"\0":t+="";break;case Io:t+="";break;default:t+=s}}return t}function Pp(n){return n+Io+""}function ot(n){let e=n.length;if(U(e>=2),e===2)return U(n.charAt(0)===Io&&n.charAt(1)===""),ae.emptyPath();let t=e-2,r=[],i="";for(let s=0;s<e;){let a=n.indexOf(Io,s);switch((a<0||a>t)&&F(),n.charAt(a+1)){case"":let c=n.substring(s,a),u;i.length===0?u=c:(i+=c,u=i,i=""),r.push(u);break;case"":i+=n.substring(s,a),i+="\0";break;case"":i+=n.substring(s,a+1);break;default:F()}s=a+2}return new ae(r)}var pn="remoteDocuments",Mi="owner",zn="owner",Ti="mutationQueues",jT="userId",Qe="mutations",kp="batchId",wn="userMutationsIndex",Cp=["userId","batchId"];function co(n,e){return[n,Ce(e)]}function Sm(n,e,t){return[n,Ce(e),t]}var zT={},ir="documentMutations",To="remoteDocumentsV14",$T=["prefixPath","collectionGroup","readTime","documentId"],uo="documentKeyIndex",KT=["prefixPath","collectionGroup","documentId"],Rm="collectionGroupIndex",GT=["collectionGroup","readTime","prefixPath","documentId"],Ei="remoteDocumentGlobal",vu="remoteDocumentGlobalKey",sr="targets",Pm="queryTargetsIndex",HT=["canonicalId","targetId"],or="targetDocuments",WT=["targetId","path"],$l="documentTargetsIndex",QT=["path","targetId"],Eo="targetGlobalKey",En="targetGlobal",bi="collectionParents",YT=["collectionId","parent"],ar="clientMetadata",JT="clientId",na="bundles",XT="bundleId",ra="namedQueries",ZT="name",Kl="indexConfiguration",eE="indexId",Iu="collectionGroupIndex",tE="collectionGroup",bo="indexState",nE=["indexId","uid"],km="sequenceNumberIndex",rE=["uid","sequenceNumber"],Ao="indexEntries",iE=["indexId","uid","arrayValue","directionalValue","orderedDocumentKey","documentKey"],Cm="documentKeyIndex",sE=["indexId","uid","orderedDocumentKey"],ia="documentOverlays",oE=["userId","collectionPath","documentId"],Tu="collectionPathOverlayIndex",aE=["userId","collectionPath","largestBatchId"],Dm="collectionGroupOverlayIndex",cE=["userId","collectionGroup","largestBatchId"],Gl="globals",uE="name",Nm=[Ti,Qe,ir,pn,sr,Mi,En,or,ar,Ei,bi,na,ra],lE=[...Nm,ia],Om=[Ti,Qe,ir,To,sr,Mi,En,or,ar,Ei,bi,na,ra,ia],xm=Om,Hl=[...xm,Kl,bo,Ao],hE=Hl,dE=[...Hl,Gl];var Ai=class extends yo{constructor(e,t){super(),this.ue=e,this.currentSequenceNumber=t}};function fe(n,e){let t=ne(n);return rr.M(t.ue,e)}function Dp(n){let e=0;for(let t in n)Object.prototype.hasOwnProperty.call(n,t)&&e++;return e}function Wl(n,e){for(let t in n)Object.prototype.hasOwnProperty.call(n,t)&&e(t,n[t])}function fE(n){for(let e in n)if(Object.prototype.hasOwnProperty.call(n,e))return!1;return!0}var Fe=class n{constructor(e,t){this.comparator=e,this.root=t||ct.EMPTY}insert(e,t){return new n(this.comparator,this.root.insert(e,t,this.comparator).copy(null,null,ct.BLACK,null,null))}remove(e){return new n(this.comparator,this.root.remove(e,this.comparator).copy(null,null,ct.BLACK,null,null))}get(e){let t=this.root;for(;!t.isEmpty();){let r=this.comparator(e,t.key);if(r===0)return t.value;r<0?t=t.left:r>0&&(t=t.right)}return null}indexOf(e){let t=0,r=this.root;for(;!r.isEmpty();){let i=this.comparator(e,r.key);if(i===0)return t+r.left.size;i<0?r=r.left:(t+=r.left.size+1,r=r.right)}return-1}isEmpty(){return this.root.isEmpty()}get size(){return this.root.size}minKey(){return this.root.minKey()}maxKey(){return this.root.maxKey()}inorderTraversal(e){return this.root.inorderTraversal(e)}forEach(e){this.inorderTraversal((t,r)=>(e(t,r),!1))}toString(){let e=[];return this.inorderTraversal((t,r)=>(e.push(`${t}:${r}`),!1)),`{${e.join(", ")}}`}reverseTraversal(e){return this.root.reverseTraversal(e)}getIterator(){return new Zn(this.root,null,this.comparator,!1)}getIteratorFrom(e){return new Zn(this.root,e,this.comparator,!1)}getReverseIterator(){return new Zn(this.root,null,this.comparator,!0)}getReverseIteratorFrom(e){return new Zn(this.root,e,this.comparator,!0)}},Zn=class{constructor(e,t,r,i){this.isReverse=i,this.nodeStack=[];let s=1;for(;!e.isEmpty();)if(s=t?r(e.key,t):1,t&&i&&(s*=-1),s<0)e=this.isReverse?e.left:e.right;else{if(s===0){this.nodeStack.push(e);break}this.nodeStack.push(e),e=this.isReverse?e.right:e.left}}getNext(){let e=this.nodeStack.pop(),t={key:e.key,value:e.value};if(this.isReverse)for(e=e.left;!e.isEmpty();)this.nodeStack.push(e),e=e.right;else for(e=e.right;!e.isEmpty();)this.nodeStack.push(e),e=e.left;return t}hasNext(){return this.nodeStack.length>0}peek(){if(this.nodeStack.length===0)return null;let e=this.nodeStack[this.nodeStack.length-1];return{key:e.key,value:e.value}}},ct=class n{constructor(e,t,r,i,s){this.key=e,this.value=t,this.color=r??n.RED,this.left=i??n.EMPTY,this.right=s??n.EMPTY,this.size=this.left.size+1+this.right.size}copy(e,t,r,i,s){return new n(e??this.key,t??this.value,r??this.color,i??this.left,s??this.right)}isEmpty(){return!1}inorderTraversal(e){return this.left.inorderTraversal(e)||e(this.key,this.value)||this.right.inorderTraversal(e)}reverseTraversal(e){return this.right.reverseTraversal(e)||e(this.key,this.value)||this.left.reverseTraversal(e)}min(){return this.left.isEmpty()?this:this.left.min()}minKey(){return this.min().key}maxKey(){return this.right.isEmpty()?this.key:this.right.maxKey()}insert(e,t,r){let i=this,s=r(e,i.key);return i=s<0?i.copy(null,null,null,i.left.insert(e,t,r),null):s===0?i.copy(null,t,null,null,null):i.copy(null,null,null,null,i.right.insert(e,t,r)),i.fixUp()}removeMin(){if(this.left.isEmpty())return n.EMPTY;let e=this;return e.left.isRed()||e.left.left.isRed()||(e=e.moveRedLeft()),e=e.copy(null,null,null,e.left.removeMin(),null),e.fixUp()}remove(e,t){let r,i=this;if(t(e,i.key)<0)i.left.isEmpty()||i.left.isRed()||i.left.left.isRed()||(i=i.moveRedLeft()),i=i.copy(null,null,null,i.left.remove(e,t),null);else{if(i.left.isRed()&&(i=i.rotateRight()),i.right.isEmpty()||i.right.isRed()||i.right.left.isRed()||(i=i.moveRedRight()),t(e,i.key)===0){if(i.right.isEmpty())return n.EMPTY;r=i.right.min(),i=i.copy(r.key,r.value,null,null,i.right.removeMin())}i=i.copy(null,null,null,null,i.right.remove(e,t))}return i.fixUp()}isRed(){return this.color}fixUp(){let e=this;return e.right.isRed()&&!e.left.isRed()&&(e=e.rotateLeft()),e.left.isRed()&&e.left.left.isRed()&&(e=e.rotateRight()),e.left.isRed()&&e.right.isRed()&&(e=e.colorFlip()),e}moveRedLeft(){let e=this.colorFlip();return e.right.left.isRed()&&(e=e.copy(null,null,null,null,e.right.rotateRight()),e=e.rotateLeft(),e=e.colorFlip()),e}moveRedRight(){let e=this.colorFlip();return e.left.left.isRed()&&(e=e.rotateRight(),e=e.colorFlip()),e}rotateLeft(){let e=this.copy(null,null,n.RED,null,this.right.left);return this.right.copy(null,null,this.color,e,null)}rotateRight(){let e=this.copy(null,null,n.RED,this.left.right,null);return this.left.copy(null,null,this.color,null,e)}colorFlip(){let e=this.left.copy(null,null,!this.left.color,null,null),t=this.right.copy(null,null,!this.right.color,null,null);return this.copy(null,null,!this.color,e,t)}checkMaxDepth(){let e=this.check();return Math.pow(2,e)<=this.size+1}check(){if(this.isRed()&&this.left.isRed()||this.right.isRed())throw F();let e=this.left.check();if(e!==this.right.check())throw F();return e+(this.isRed()?0:1)}};ct.EMPTY=null,ct.RED=!0,ct.BLACK=!1;ct.EMPTY=new class{constructor(){this.size=0}get key(){throw F()}get value(){throw F()}get color(){throw F()}get left(){throw F()}get right(){throw F()}copy(e,t,r,i,s){return this}insert(e,t,r){return new ct(e,t)}remove(e,t){return this}isEmpty(){return!0}inorderTraversal(e){return!1}reverseTraversal(e){return!1}minKey(){return null}maxKey(){return null}isRed(){return!1}checkMaxDepth(){return!0}check(){return 0}};var Z=class n{constructor(e){this.comparator=e,this.data=new Fe(this.comparator)}has(e){return this.data.get(e)!==null}first(){return this.data.minKey()}last(){return this.data.maxKey()}get size(){return this.data.size}indexOf(e){return this.data.indexOf(e)}forEach(e){this.data.inorderTraversal((t,r)=>(e(t),!1))}forEachInRange(e,t){let r=this.data.getIteratorFrom(e[0]);for(;r.hasNext();){let i=r.getNext();if(this.comparator(i.key,e[1])>=0)return;t(i.key)}}forEachWhile(e,t){let r;for(r=t!==void 0?this.data.getIteratorFrom(t):this.data.getIterator();r.hasNext();)if(!e(r.getNext().key))return}firstAfterOrEqual(e){let t=this.data.getIteratorFrom(e);return t.hasNext()?t.getNext().key:null}getIterator(){return new So(this.data.getIterator())}getIteratorFrom(e){return new So(this.data.getIteratorFrom(e))}add(e){return this.copy(this.data.remove(e).insert(e,!0))}delete(e){return this.has(e)?this.copy(this.data.remove(e)):this}isEmpty(){return this.data.isEmpty()}unionWith(e){let t=this;return t.size<e.size&&(t=e,e=this),e.forEach(r=>{t=t.add(r)}),t}isEqual(e){if(!(e instanceof n)||this.size!==e.size)return!1;let t=this.data.getIterator(),r=e.data.getIterator();for(;t.hasNext();){let i=t.getNext().key,s=r.getNext().key;if(this.comparator(i,s)!==0)return!1}return!0}toArray(){let e=[];return this.forEach(t=>{e.push(t)}),e}toString(){let e=[];return this.forEach(t=>e.push(t)),"SortedSet("+e.toString()+")"}copy(e){let t=new n(this.comparator);return t.data=e,t}},So=class{constructor(e){this.iter=e}getNext(){return this.iter.getNext().key}hasNext(){return this.iter.hasNext()}};function $n(n){return n.hasNext()?n.getNext():void 0}var Ut=class n{constructor(e){this.fields=e,e.sort(Se.comparator)}static empty(){return new n([])}unionWith(e){let t=new Z(Se.comparator);for(let r of this.fields)t=t.add(r);for(let r of e)t=t.add(r);return new n(t.toArray())}covers(e){for(let t of this.fields)if(t.isPrefixOf(e))return!0;return!1}isEqual(e){return tr(this.fields,e.fields,(t,r)=>t.isEqual(r))}};var Eu=class extends Error{constructor(){super(...arguments),this.name="Base64DecodeError"}};var Je=class n{constructor(e){this.binaryString=e}static fromBase64String(e){let t=function(i){try{return atob(i)}catch(s){throw typeof DOMException<"u"&&s instanceof DOMException?new Eu("Invalid base64 string: "+s):s}}(e);return new n(t)}static fromUint8Array(e){let t=function(i){let s="";for(let a=0;a<i.length;++a)s+=String.fromCharCode(i[a]);return s}(e);return new n(t)}[Symbol.iterator](){let e=0;return{next:()=>e<this.binaryString.length?{value:this.binaryString.charCodeAt(e++),done:!1}:{value:void 0,done:!0}}}toBase64(){return function(t){return btoa(t)}(this.binaryString)}toUint8Array(){return function(t){let r=new Uint8Array(t.length);for(let i=0;i<t.length;i++)r[i]=t.charCodeAt(i);return r}(this.binaryString)}approximateByteSize(){return 2*this.binaryString.length}compareTo(e){return $(this.binaryString,e.binaryString)}isEqual(e){return this.binaryString===e.binaryString}};Je.EMPTY_BYTE_STRING=new Je("");var pE=new RegExp(/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.(\d+))?Z$/);function jt(n){if(U(!!n),typeof n=="string"){let e=0,t=pE.exec(n);if(U(!!t),t[1]){let i=t[1];i=(i+"000000000").substr(0,9),e=Number(i)}let r=new Date(n);return{seconds:Math.floor(r.getTime()/1e3),nanos:e}}return{seconds:le(n.seconds),nanos:le(n.nanos)}}function le(n){return typeof n=="number"?n:typeof n=="string"?Number(n):0}function cr(n){return typeof n=="string"?Je.fromBase64String(n):Je.fromUint8Array(n)}var Vm="server_timestamp",Lm="__type__",Mm="__previous_value__",Fm="__local_write_time__";function Ql(n){var e,t;return((t=(((e=n?.mapValue)===null||e===void 0?void 0:e.fields)||{})[Lm])===null||t===void 0?void 0:t.stringValue)===Vm}function Um(n){let e=n.mapValue.fields[Mm];return Ql(e)?Um(e):e}function Ro(n){let e=jt(n.mapValue.fields[Fm].timestampValue);return new ke(e.seconds,e.nanos)}var Si="(default)",Ri=class n{constructor(e,t){this.projectId=e,this.database=t||Si}static empty(){return new n("","")}get isDefaultDatabase(){return this.database===Si}isEqual(e){return e instanceof n&&e.projectId===this.projectId&&e.database===this.database}};var Bm="__type__",qm="__max__",Bt={mapValue:{fields:{__type__:{stringValue:qm}}}},jm="__vector__",Po="value",lo={nullValue:"NULL_VALUE"};function ur(n){return"nullValue"in n?0:"booleanValue"in n?1:"integerValue"in n||"doubleValue"in n?2:"timestampValue"in n?3:"stringValue"in n?5:"bytesValue"in n?6:"referenceValue"in n?7:"geoPointValue"in n?8:"arrayValue"in n?9:"mapValue"in n?Ql(n)?4:zm(n)?9007199254740991:sa(n)?10:11:F()}function ut(n,e){if(n===e)return!0;let t=ur(n);if(t!==ur(e))return!1;switch(t){case 0:case 9007199254740991:return!0;case 1:return n.booleanValue===e.booleanValue;case 4:return Ro(n).isEqual(Ro(e));case 3:return function(i,s){if(typeof i.timestampValue=="string"&&typeof s.timestampValue=="string"&&i.timestampValue.length===s.timestampValue.length)return i.timestampValue===s.timestampValue;let a=jt(i.timestampValue),c=jt(s.timestampValue);return a.seconds===c.seconds&&a.nanos===c.nanos}(n,e);case 5:return n.stringValue===e.stringValue;case 6:return function(i,s){return cr(i.bytesValue).isEqual(cr(s.bytesValue))}(n,e);case 7:return n.referenceValue===e.referenceValue;case 8:return function(i,s){return le(i.geoPointValue.latitude)===le(s.geoPointValue.latitude)&&le(i.geoPointValue.longitude)===le(s.geoPointValue.longitude)}(n,e);case 2:return function(i,s){if("integerValue"in i&&"integerValue"in s)return le(i.integerValue)===le(s.integerValue);if("doubleValue"in i&&"doubleValue"in s){let a=le(i.doubleValue),c=le(s.doubleValue);return a===c?vo(a)===vo(c):isNaN(a)&&isNaN(c)}return!1}(n,e);case 9:return tr(n.arrayValue.values||[],e.arrayValue.values||[],ut);case 10:case 11:return function(i,s){let a=i.mapValue.fields||{},c=s.mapValue.fields||{};if(Dp(a)!==Dp(c))return!1;for(let u in a)if(a.hasOwnProperty(u)&&(c[u]===void 0||!ut(a[u],c[u])))return!1;return!0}(n,e);default:return F()}}function Pi(n,e){return(n.values||[]).find(t=>ut(t,e))!==void 0}function zt(n,e){if(n===e)return 0;let t=ur(n),r=ur(e);if(t!==r)return $(t,r);switch(t){case 0:case 9007199254740991:return 0;case 1:return $(n.booleanValue,e.booleanValue);case 2:return function(s,a){let c=le(s.integerValue||s.doubleValue),u=le(a.integerValue||a.doubleValue);return c<u?-1:c>u?1:c===u?0:isNaN(c)?isNaN(u)?0:-1:1}(n,e);case 3:return Np(n.timestampValue,e.timestampValue);case 4:return Np(Ro(n),Ro(e));case 5:return $(n.stringValue,e.stringValue);case 6:return function(s,a){let c=cr(s),u=cr(a);return c.compareTo(u)}(n.bytesValue,e.bytesValue);case 7:return function(s,a){let c=s.split("/"),u=a.split("/");for(let d=0;d<c.length&&d<u.length;d++){let f=$(c[d],u[d]);if(f!==0)return f}return $(c.length,u.length)}(n.referenceValue,e.referenceValue);case 8:return function(s,a){let c=$(le(s.latitude),le(a.latitude));return c!==0?c:$(le(s.longitude),le(a.longitude))}(n.geoPointValue,e.geoPointValue);case 9:return Op(n.arrayValue,e.arrayValue);case 10:return function(s,a){var c,u,d,f;let g=s.fields||{},b=a.fields||{},R=(c=g[Po])===null||c===void 0?void 0:c.arrayValue,k=(u=b[Po])===null||u===void 0?void 0:u.arrayValue,O=$(((d=R?.values)===null||d===void 0?void 0:d.length)||0,((f=k?.values)===null||f===void 0?void 0:f.length)||0);return O!==0?O:Op(R,k)}(n.mapValue,e.mapValue);case 11:return function(s,a){if(s===Bt.mapValue&&a===Bt.mapValue)return 0;if(s===Bt.mapValue)return 1;if(a===Bt.mapValue)return-1;let c=s.fields||{},u=Object.keys(c),d=a.fields||{},f=Object.keys(d);u.sort(),f.sort();for(let g=0;g<u.length&&g<f.length;++g){let b=$(u[g],f[g]);if(b!==0)return b;let R=zt(c[u[g]],d[f[g]]);if(R!==0)return R}return $(u.length,f.length)}(n.mapValue,e.mapValue);default:throw F()}}function Np(n,e){if(typeof n=="string"&&typeof e=="string"&&n.length===e.length)return $(n,e);let t=jt(n),r=jt(e),i=$(t.seconds,r.seconds);return i!==0?i:$(t.nanos,r.nanos)}function Op(n,e){let t=n.values||[],r=e.values||[];for(let i=0;i<t.length&&i<r.length;++i){let s=zt(t[i],r[i]);if(s)return s}return $(t.length,r.length)}function lr(n){return bu(n)}function bu(n){return"nullValue"in n?"null":"booleanValue"in n?""+n.booleanValue:"integerValue"in n?""+n.integerValue:"doubleValue"in n?""+n.doubleValue:"timestampValue"in n?function(t){let r=jt(t);return`time(${r.seconds},${r.nanos})`}(n.timestampValue):"stringValue"in n?n.stringValue:"bytesValue"in n?function(t){return cr(t).toBase64()}(n.bytesValue):"referenceValue"in n?function(t){return V.fromName(t).toString()}(n.referenceValue):"geoPointValue"in n?function(t){return`geo(${t.latitude},${t.longitude})`}(n.geoPointValue):"arrayValue"in n?function(t){let r="[",i=!0;for(let s of t.values||[])i?i=!1:r+=",",r+=bu(s);return r+"]"}(n.arrayValue):"mapValue"in n?function(t){let r=Object.keys(t.fields||{}).sort(),i="{",s=!0;for(let a of r)s?s=!1:i+=",",i+=`${a}:${bu(t.fields[a])}`;return i+"}"}(n.mapValue):F()}function Yl(n,e){return{referenceValue:`projects/${n.projectId}/databases/${n.database}/documents/${e.path.canonicalString()}`}}function Au(n){return!!n&&"integerValue"in n}function ki(n){return!!n&&"arrayValue"in n}function xp(n){return!!n&&"nullValue"in n}function Vp(n){return!!n&&"doubleValue"in n&&isNaN(Number(n.doubleValue))}function ru(n){return!!n&&"mapValue"in n}function sa(n){var e,t;return((t=(((e=n?.mapValue)===null||e===void 0?void 0:e.fields)||{})[Bm])===null||t===void 0?void 0:t.stringValue)===jm}function gi(n){if(n.geoPointValue)return{geoPointValue:Object.assign({},n.geoPointValue)};if(n.timestampValue&&typeof n.timestampValue=="object")return{timestampValue:Object.assign({},n.timestampValue)};if(n.mapValue){let e={mapValue:{fields:{}}};return Wl(n.mapValue.fields,(t,r)=>e.mapValue.fields[t]=gi(r)),e}if(n.arrayValue){let e={arrayValue:{values:[]}};for(let t=0;t<(n.arrayValue.values||[]).length;++t)e.arrayValue.values[t]=gi(n.arrayValue.values[t]);return e}return Object.assign({},n)}function zm(n){return(((n.mapValue||{}).fields||{}).__type__||{}).stringValue===qm}var $m={mapValue:{fields:{[Bm]:{stringValue:jm},[Po]:{arrayValue:{}}}}};function mE(n){return"nullValue"in n?lo:"booleanValue"in n?{booleanValue:!1}:"integerValue"in n||"doubleValue"in n?{doubleValue:NaN}:"timestampValue"in n?{timestampValue:{seconds:Number.MIN_SAFE_INTEGER}}:"stringValue"in n?{stringValue:""}:"bytesValue"in n?{bytesValue:""}:"referenceValue"in n?Yl(Ri.empty(),V.empty()):"geoPointValue"in n?{geoPointValue:{latitude:-90,longitude:-180}}:"arrayValue"in n?{arrayValue:{}}:"mapValue"in n?sa(n)?$m:{mapValue:{}}:F()}function gE(n){return"nullValue"in n?{booleanValue:!1}:"booleanValue"in n?{doubleValue:NaN}:"integerValue"in n||"doubleValue"in n?{timestampValue:{seconds:Number.MIN_SAFE_INTEGER}}:"timestampValue"in n?{stringValue:""}:"stringValue"in n?{bytesValue:""}:"bytesValue"in n?Yl(Ri.empty(),V.empty()):"referenceValue"in n?{geoPointValue:{latitude:-90,longitude:-180}}:"geoPointValue"in n?{arrayValue:{}}:"arrayValue"in n?$m:"mapValue"in n?sa(n)?{mapValue:{}}:Bt:F()}function Lp(n,e){let t=zt(n.value,e.value);return t!==0?t:n.inclusive&&!e.inclusive?-1:!n.inclusive&&e.inclusive?1:0}function Mp(n,e){let t=zt(n.value,e.value);return t!==0?t:n.inclusive&&!e.inclusive?1:!n.inclusive&&e.inclusive?-1:0}var st=class n{constructor(e){this.value=e}static empty(){return new n({mapValue:{}})}field(e){if(e.isEmpty())return this.value;{let t=this.value;for(let r=0;r<e.length-1;++r)if(t=(t.mapValue.fields||{})[e.get(r)],!ru(t))return null;return t=(t.mapValue.fields||{})[e.lastSegment()],t||null}}set(e,t){this.getFieldsMap(e.popLast())[e.lastSegment()]=gi(t)}setAll(e){let t=Se.emptyPath(),r={},i=[];e.forEach((a,c)=>{if(!t.isImmediateParentOf(c)){let u=this.getFieldsMap(t);this.applyChanges(u,r,i),r={},i=[],t=c.popLast()}a?r[c.lastSegment()]=gi(a):i.push(c.lastSegment())});let s=this.getFieldsMap(t);this.applyChanges(s,r,i)}delete(e){let t=this.field(e.popLast());ru(t)&&t.mapValue.fields&&delete t.mapValue.fields[e.lastSegment()]}isEqual(e){return ut(this.value,e.value)}getFieldsMap(e){let t=this.value;t.mapValue.fields||(t.mapValue={fields:{}});for(let r=0;r<e.length;++r){let i=t.mapValue.fields[e.get(r)];ru(i)&&i.mapValue.fields||(i={mapValue:{fields:{}}},t.mapValue.fields[e.get(r)]=i),t=i}return t.mapValue.fields}applyChanges(e,t,r){Wl(t,(i,s)=>e[i]=s);for(let i of r)delete e[i]}clone(){return new n(gi(this.value))}};var ze=class n{constructor(e,t,r,i,s,a,c){this.key=e,this.documentType=t,this.version=r,this.readTime=i,this.createTime=s,this.data=a,this.documentState=c}static newInvalidDocument(e){return new n(e,0,Q.min(),Q.min(),Q.min(),st.empty(),0)}static newFoundDocument(e,t,r,i){return new n(e,1,t,Q.min(),r,i,0)}static newNoDocument(e,t){return new n(e,2,t,Q.min(),Q.min(),st.empty(),0)}static newUnknownDocument(e,t){return new n(e,3,t,Q.min(),Q.min(),st.empty(),2)}convertToFoundDocument(e,t){return!this.createTime.isEqual(Q.min())||this.documentType!==2&&this.documentType!==0||(this.createTime=e),this.version=e,this.documentType=1,this.data=t,this.documentState=0,this}convertToNoDocument(e){return this.version=e,this.documentType=2,this.data=st.empty(),this.documentState=0,this}convertToUnknownDocument(e){return this.version=e,this.documentType=3,this.data=st.empty(),this.documentState=2,this}setHasCommittedMutations(){return this.documentState=2,this}setHasLocalMutations(){return this.documentState=1,this.version=Q.min(),this}setReadTime(e){return this.readTime=e,this}get hasLocalMutations(){return this.documentState===1}get hasCommittedMutations(){return this.documentState===2}get hasPendingWrites(){return this.hasLocalMutations||this.hasCommittedMutations}isValidDocument(){return this.documentType!==0}isFoundDocument(){return this.documentType===1}isNoDocument(){return this.documentType===2}isUnknownDocument(){return this.documentType===3}isEqual(e){return e instanceof n&&this.key.isEqual(e.key)&&this.version.isEqual(e.version)&&this.documentType===e.documentType&&this.documentState===e.documentState&&this.data.isEqual(e.data)}mutableCopy(){return new n(this.key,this.documentType,this.version,this.readTime,this.createTime,this.data.clone(),this.documentState)}toString(){return`Document(${this.key}, ${this.version}, ${JSON.stringify(this.data.value)}, {createTime: ${this.createTime}}), {documentType: ${this.documentType}}), {documentState: ${this.documentState}})`}};var $t=class{constructor(e,t){this.position=e,this.inclusive=t}};function Fp(n,e,t){let r=0;for(let i=0;i<n.position.length;i++){let s=e[i],a=n.position[i];if(s.field.isKeyField()?r=V.comparator(V.fromName(a.referenceValue),t.key):r=zt(a,t.data.field(s.field)),s.dir==="desc"&&(r*=-1),r!==0)break}return r}function Up(n,e){if(n===null)return e===null;if(e===null||n.inclusive!==e.inclusive||n.position.length!==e.position.length)return!1;for(let t=0;t<n.position.length;t++)if(!ut(n.position[t],e.position[t]))return!1;return!0}var hr=class{constructor(e,t="asc"){this.field=e,this.dir=t}};function _E(n,e){return n.dir===e.dir&&n.field.isEqual(e.field)}var ko=class{},K=class n extends ko{constructor(e,t,r){super(),this.field=e,this.op=t,this.value=r}static create(e,t,r){return e.isKeyField()?t==="in"||t==="not-in"?this.createKeyFieldInFilter(e,t,r):new Pu(e,t,r):t==="array-contains"?new Du(e,r):t==="in"?new Co(e,r):t==="not-in"?new Nu(e,r):t==="array-contains-any"?new Ou(e,r):new n(e,t,r)}static createKeyFieldInFilter(e,t,r){return t==="in"?new ku(e,r):new Cu(e,r)}matches(e){let t=e.data.field(this.field);return this.op==="!="?t!==null&&this.matchesComparison(zt(t,this.value)):t!==null&&ur(this.value)===ur(t)&&this.matchesComparison(zt(t,this.value))}matchesComparison(e){switch(this.op){case"<":return e<0;case"<=":return e<=0;case"==":return e===0;case"!=":return e!==0;case">":return e>0;case">=":return e>=0;default:return F()}}isInequality(){return["<","<=",">",">=","!=","not-in"].indexOf(this.op)>=0}getFlattenedFilters(){return[this]}getFilters(){return[this]}},J=class n extends ko{constructor(e,t){super(),this.filters=e,this.op=t,this.ce=null}static create(e,t){return new n(e,t)}matches(e){return dr(this)?this.filters.find(t=>!t.matches(e))===void 0:this.filters.find(t=>t.matches(e))!==void 0}getFlattenedFilters(){return this.ce!==null||(this.ce=this.filters.reduce((e,t)=>e.concat(t.getFlattenedFilters()),[])),this.ce}getFilters(){return Object.assign([],this.filters)}};function dr(n){return n.op==="and"}function Su(n){return n.op==="or"}function Jl(n){return Km(n)&&dr(n)}function Km(n){for(let e of n.filters)if(e instanceof J)return!1;return!0}function Ru(n){if(n instanceof K)return n.field.canonicalString()+n.op.toString()+lr(n.value);if(Jl(n))return n.filters.map(e=>Ru(e)).join(",");{let e=n.filters.map(t=>Ru(t)).join(",");return`${n.op}(${e})`}}function Gm(n,e){return n instanceof K?function(r,i){return i instanceof K&&r.op===i.op&&r.field.isEqual(i.field)&&ut(r.value,i.value)}(n,e):n instanceof J?function(r,i){return i instanceof J&&r.op===i.op&&r.filters.length===i.filters.length?r.filters.reduce((s,a,c)=>s&&Gm(a,i.filters[c]),!0):!1}(n,e):void F()}function Hm(n,e){let t=n.filters.concat(e);return J.create(t,n.op)}function Wm(n){return n instanceof K?function(t){return`${t.field.canonicalString()} ${t.op} ${lr(t.value)}`}(n):n instanceof J?function(t){return t.op.toString()+" {"+t.getFilters().map(Wm).join(" ,")+"}"}(n):"Filter"}var Pu=class extends K{constructor(e,t,r){super(e,t,r),this.key=V.fromName(r.referenceValue)}matches(e){let t=V.comparator(e.key,this.key);return this.matchesComparison(t)}},ku=class extends K{constructor(e,t){super(e,"in",t),this.keys=Qm("in",t)}matches(e){return this.keys.some(t=>t.isEqual(e.key))}},Cu=class extends K{constructor(e,t){super(e,"not-in",t),this.keys=Qm("not-in",t)}matches(e){return!this.keys.some(t=>t.isEqual(e.key))}};function Qm(n,e){var t;return(((t=e.arrayValue)===null||t===void 0?void 0:t.values)||[]).map(r=>V.fromName(r.referenceValue))}var Du=class extends K{constructor(e,t){super(e,"array-contains",t)}matches(e){let t=e.data.field(this.field);return ki(t)&&Pi(t.arrayValue,this.value)}},Co=class extends K{constructor(e,t){super(e,"in",t)}matches(e){let t=e.data.field(this.field);return t!==null&&Pi(this.value.arrayValue,t)}},Nu=class extends K{constructor(e,t){super(e,"not-in",t)}matches(e){if(Pi(this.value.arrayValue,{nullValue:"NULL_VALUE"}))return!1;let t=e.data.field(this.field);return t!==null&&!Pi(this.value.arrayValue,t)}},Ou=class extends K{constructor(e,t){super(e,"array-contains-any",t)}matches(e){let t=e.data.field(this.field);return!(!ki(t)||!t.arrayValue.values)&&t.arrayValue.values.some(r=>Pi(this.value.arrayValue,r))}};var xu=class{constructor(e,t=null,r=[],i=[],s=null,a=null,c=null){this.path=e,this.collectionGroup=t,this.orderBy=r,this.filters=i,this.limit=s,this.startAt=a,this.endAt=c,this.le=null}};function Vu(n,e=null,t=[],r=[],i=null,s=null,a=null){return new xu(n,e,t,r,i,s,a)}function An(n){let e=ne(n);if(e.le===null){let t=e.path.canonicalString();e.collectionGroup!==null&&(t+="|cg:"+e.collectionGroup),t+="|f:",t+=e.filters.map(r=>Ru(r)).join(","),t+="|ob:",t+=e.orderBy.map(r=>function(s){return s.field.canonicalString()+s.dir}(r)).join(","),ta(e.limit)||(t+="|l:",t+=e.limit),e.startAt&&(t+="|lb:",t+=e.startAt.inclusive?"b:":"a:",t+=e.startAt.position.map(r=>lr(r)).join(",")),e.endAt&&(t+="|ub:",t+=e.endAt.inclusive?"a:":"b:",t+=e.endAt.position.map(r=>lr(r)).join(",")),e.le=t}return e.le}function Fi(n,e){if(n.limit!==e.limit||n.orderBy.length!==e.orderBy.length)return!1;for(let t=0;t<n.orderBy.length;t++)if(!_E(n.orderBy[t],e.orderBy[t]))return!1;if(n.filters.length!==e.filters.length)return!1;for(let t=0;t<n.filters.length;t++)if(!Gm(n.filters[t],e.filters[t]))return!1;return n.collectionGroup===e.collectionGroup&&!!n.path.isEqual(e.path)&&!!Up(n.startAt,e.startAt)&&Up(n.endAt,e.endAt)}function yE(n){return V.isDocumentKey(n.path)&&n.collectionGroup===null&&n.filters.length===0}function Do(n,e){return n.filters.filter(t=>t instanceof K&&t.field.isEqual(e))}function Bp(n,e,t){let r=lo,i=!0;for(let s of Do(n,e)){let a=lo,c=!0;switch(s.op){case"<":case"<=":a=mE(s.value);break;case"==":case"in":case">=":a=s.value;break;case">":a=s.value,c=!1;break;case"!=":case"not-in":a=lo}Lp({value:r,inclusive:i},{value:a,inclusive:c})<0&&(r=a,i=c)}if(t!==null){for(let s=0;s<n.orderBy.length;++s)if(n.orderBy[s].field.isEqual(e)){let a=t.position[s];Lp({value:r,inclusive:i},{value:a,inclusive:t.inclusive})<0&&(r=a,i=t.inclusive);break}}return{value:r,inclusive:i}}function qp(n,e,t){let r=Bt,i=!0;for(let s of Do(n,e)){let a=Bt,c=!0;switch(s.op){case">=":case">":a=gE(s.value),c=!1;break;case"==":case"in":case"<=":a=s.value;break;case"<":a=s.value,c=!1;break;case"!=":case"not-in":a=Bt}Mp({value:r,inclusive:i},{value:a,inclusive:c})>0&&(r=a,i=c)}if(t!==null){for(let s=0;s<n.orderBy.length;++s)if(n.orderBy[s].field.isEqual(e)){let a=t.position[s];Mp({value:r,inclusive:i},{value:a,inclusive:t.inclusive})>0&&(r=a,i=t.inclusive);break}}return{value:r,inclusive:i}}var fr=class{constructor(e,t=null,r=[],i=[],s=null,a="F",c=null,u=null){this.path=e,this.collectionGroup=t,this.explicitOrderBy=r,this.filters=i,this.limit=s,this.limitType=a,this.startAt=c,this.endAt=u,this.he=null,this.Pe=null,this.Te=null,this.startAt,this.endAt}};function wE(n,e,t,r,i,s,a,c){return new fr(n,e,t,r,i,s,a,c)}function vE(n){return new fr(n)}function jp(n){return n.filters.length===0&&n.limit===null&&n.startAt==null&&n.endAt==null&&(n.explicitOrderBy.length===0||n.explicitOrderBy.length===1&&n.explicitOrderBy[0].field.isKeyField())}function IE(n){return n.collectionGroup!==null}function _i(n){let e=ne(n);if(e.he===null){e.he=[];let t=new Set;for(let s of e.explicitOrderBy)e.he.push(s),t.add(s.field.canonicalString());let r=e.explicitOrderBy.length>0?e.explicitOrderBy[e.explicitOrderBy.length-1].dir:"asc";(function(a){let c=new Z(Se.comparator);return a.filters.forEach(u=>{u.getFlattenedFilters().forEach(d=>{d.isInequality()&&(c=c.add(d.field))})}),c})(e).forEach(s=>{t.has(s.canonicalString())||s.isKeyField()||e.he.push(new hr(s,r))}),t.has(Se.keyField().canonicalString())||e.he.push(new hr(Se.keyField(),r))}return e.he}function At(n){let e=ne(n);return e.Pe||(e.Pe=TE(e,_i(n))),e.Pe}function TE(n,e){if(n.limitType==="F")return Vu(n.path,n.collectionGroup,e,n.filters,n.limit,n.startAt,n.endAt);{e=e.map(i=>{let s=i.dir==="desc"?"asc":"desc";return new hr(i.field,s)});let t=n.endAt?new $t(n.endAt.position,n.endAt.inclusive):null,r=n.startAt?new $t(n.startAt.position,n.startAt.inclusive):null;return Vu(n.path,n.collectionGroup,e,n.filters,n.limit,t,r)}}function Lu(n,e,t){return new fr(n.path,n.collectionGroup,n.explicitOrderBy.slice(),n.filters.slice(),e,t,n.startAt,n.endAt)}function Ym(n,e){return Fi(At(n),At(e))&&n.limitType===e.limitType}function Jm(n){return`${An(At(n))}|lt:${n.limitType}`}function ui(n){return`Query(target=${function(t){let r=t.path.canonicalString();return t.collectionGroup!==null&&(r+=" collectionGroup="+t.collectionGroup),t.filters.length>0&&(r+=`, filters: [${t.filters.map(i=>Wm(i)).join(", ")}]`),ta(t.limit)||(r+=", limit: "+t.limit),t.orderBy.length>0&&(r+=`, orderBy: [${t.orderBy.map(i=>function(a){return`${a.field.canonicalString()} (${a.dir})`}(i)).join(", ")}]`),t.startAt&&(r+=", startAt: ",r+=t.startAt.inclusive?"b:":"a:",r+=t.startAt.position.map(i=>lr(i)).join(",")),t.endAt&&(r+=", endAt: ",r+=t.endAt.inclusive?"a:":"b:",r+=t.endAt.position.map(i=>lr(i)).join(",")),`Target(${r})`}(At(n))}; limitType=${n.limitType})`}function oa(n,e){return e.isFoundDocument()&&function(r,i){let s=i.key.path;return r.collectionGroup!==null?i.key.hasCollectionId(r.collectionGroup)&&r.path.isPrefixOf(s):V.isDocumentKey(r.path)?r.path.isEqual(s):r.path.isImmediateParentOf(s)}(n,e)&&function(r,i){for(let s of _i(r))if(!s.field.isKeyField()&&i.data.field(s.field)===null)return!1;return!0}(n,e)&&function(r,i){for(let s of r.filters)if(!s.matches(i))return!1;return!0}(n,e)&&function(r,i){return!(r.startAt&&!function(a,c,u){let d=Fp(a,c,u);return a.inclusive?d<=0:d<0}(r.startAt,_i(r),i)||r.endAt&&!function(a,c,u){let d=Fp(a,c,u);return a.inclusive?d>=0:d>0}(r.endAt,_i(r),i))}(n,e)}function EE(n){return(e,t)=>{let r=!1;for(let i of _i(n)){let s=bE(i,e,t);if(s!==0)return s;r=r||i.field.isKeyField()}return 0}}function bE(n,e,t){let r=n.field.isKeyField()?V.comparator(e.key,t.key):function(s,a,c){let u=a.data.field(s),d=c.data.field(s);return u!==null&&d!==null?zt(u,d):F()}(n.field,e,t);switch(n.dir){case"asc":return r;case"desc":return-1*r;default:return F()}}var lt=class{constructor(e,t){this.mapKeyFn=e,this.equalsFn=t,this.inner={},this.innerSize=0}get(e){let t=this.mapKeyFn(e),r=this.inner[t];if(r!==void 0){for(let[i,s]of r)if(this.equalsFn(i,e))return s}}has(e){return this.get(e)!==void 0}set(e,t){let r=this.mapKeyFn(e),i=this.inner[r];if(i===void 0)return this.inner[r]=[[e,t]],void this.innerSize++;for(let s=0;s<i.length;s++)if(this.equalsFn(i[s][0],e))return void(i[s]=[e,t]);i.push([e,t]),this.innerSize++}delete(e){let t=this.mapKeyFn(e),r=this.inner[t];if(r===void 0)return!1;for(let i=0;i<r.length;i++)if(this.equalsFn(r[i][0],e))return r.length===1?delete this.inner[t]:r.splice(i,1),this.innerSize--,!0;return!1}forEach(e){Wl(this.inner,(t,r)=>{for(let[i,s]of r)e(i,s)})}isEmpty(){return fE(this.inner)}size(){return this.innerSize}};var AE=new Fe(V.comparator);function vn(){return AE}var Xm=new Fe(V.comparator);function ro(...n){let e=Xm;for(let t of n)e=e.insert(t.key,t);return e}function SE(n){let e=Xm;return n.forEach((t,r)=>e=e.insert(t,r.overlayedDocument)),e}function at(){return yi()}function Zm(){return yi()}function yi(){return new lt(n=>n.toString(),(n,e)=>n.isEqual(e))}var RE=new Fe(V.comparator),PE=new Z(V.comparator);function we(...n){let e=PE;for(let t of n)e=e.add(t);return e}var kE=new Z($);function CE(){return kE}function DE(n,e){if(n.useProto3Json){if(isNaN(e))return{doubleValue:"NaN"};if(e===1/0)return{doubleValue:"Infinity"};if(e===-1/0)return{doubleValue:"-Infinity"}}return{doubleValue:vo(e)?"-0":e}}function NE(n){return{integerValue:""+n}}var pr=class{constructor(){this._=void 0}};function OE(n,e,t){return n instanceof Sn?function(i,s){let a={fields:{[Lm]:{stringValue:Vm},[Fm]:{timestampValue:{seconds:i.seconds,nanos:i.nanoseconds}}}};return s&&Ql(s)&&(s=Um(s)),s&&(a.fields[Mm]=s),{mapValue:a}}(t,e):n instanceof Kt?eg(n,e):n instanceof Gt?tg(n,e):function(i,s){let a=VE(i,s),c=zp(a)+zp(i.Ie);return Au(a)&&Au(i.Ie)?NE(c):DE(i.serializer,c)}(n,e)}function xE(n,e,t){return n instanceof Kt?eg(n,e):n instanceof Gt?tg(n,e):t}function VE(n,e){return n instanceof Rn?function(r){return Au(r)||function(s){return!!s&&"doubleValue"in s}(r)}(e)?e:{integerValue:0}:null}var Sn=class extends pr{},Kt=class extends pr{constructor(e){super(),this.elements=e}};function eg(n,e){let t=ng(e);for(let r of n.elements)t.some(i=>ut(i,r))||t.push(r);return{arrayValue:{values:t}}}var Gt=class extends pr{constructor(e){super(),this.elements=e}};function tg(n,e){let t=ng(e);for(let r of n.elements)t=t.filter(i=>!ut(i,r));return{arrayValue:{values:t}}}var Rn=class extends pr{constructor(e,t){super(),this.serializer=e,this.Ie=t}};function zp(n){return le(n.integerValue||n.doubleValue)}function ng(n){return ki(n)&&n.arrayValue.values?n.arrayValue.values.slice():[]}var Mu=class{constructor(e,t){this.field=e,this.transform=t}};function LE(n,e){return n.field.isEqual(e.field)&&function(r,i){return r instanceof Kt&&i instanceof Kt||r instanceof Gt&&i instanceof Gt?tr(r.elements,i.elements,ut):r instanceof Rn&&i instanceof Rn?ut(r.Ie,i.Ie):r instanceof Sn&&i instanceof Sn}(n.transform,e.transform)}var Fu=class{constructor(e,t){this.version=e,this.transformResults=t}},bt=class n{constructor(e,t){this.updateTime=e,this.exists=t}static none(){return new n}static exists(e){return new n(void 0,e)}static updateTime(e){return new n(e)}get isNone(){return this.updateTime===void 0&&this.exists===void 0}isEqual(e){return this.exists===e.exists&&(this.updateTime?!!e.updateTime&&this.updateTime.isEqual(e.updateTime):!e.updateTime)}};function ho(n,e){return n.updateTime!==void 0?e.isFoundDocument()&&e.version.isEqual(n.updateTime):n.exists===void 0||n.exists===e.isFoundDocument()}var mr=class{};function rg(n,e){if(!n.hasLocalMutations||e&&e.fields.length===0)return null;if(e===null)return n.isNoDocument()?new Ci(n.key,bt.none()):new Pn(n.key,n.data,bt.none());{let t=n.data,r=st.empty(),i=new Z(Se.comparator);for(let s of e.fields)if(!i.has(s)){let a=t.field(s);a===null&&s.length>1&&(s=s.popLast(),a=t.field(s)),a===null?r.delete(s):r.set(s,a),i=i.add(s)}return new Ht(n.key,r,new Ut(i.toArray()),bt.none())}}function ME(n,e,t){n instanceof Pn?function(i,s,a){let c=i.value.clone(),u=Kp(i.fieldTransforms,s,a.transformResults);c.setAll(u),s.convertToFoundDocument(a.version,c).setHasCommittedMutations()}(n,e,t):n instanceof Ht?function(i,s,a){if(!ho(i.precondition,s))return void s.convertToUnknownDocument(a.version);let c=Kp(i.fieldTransforms,s,a.transformResults),u=s.data;u.setAll(ig(i)),u.setAll(c),s.convertToFoundDocument(a.version,u).setHasCommittedMutations()}(n,e,t):function(i,s,a){s.convertToNoDocument(a.version).setHasCommittedMutations()}(0,e,t)}function wi(n,e,t,r){return n instanceof Pn?function(s,a,c,u){if(!ho(s.precondition,a))return c;let d=s.value.clone(),f=Gp(s.fieldTransforms,u,a);return d.setAll(f),a.convertToFoundDocument(a.version,d).setHasLocalMutations(),null}(n,e,t,r):n instanceof Ht?function(s,a,c,u){if(!ho(s.precondition,a))return c;let d=Gp(s.fieldTransforms,u,a),f=a.data;return f.setAll(ig(s)),f.setAll(d),a.convertToFoundDocument(a.version,f).setHasLocalMutations(),c===null?null:c.unionWith(s.fieldMask.fields).unionWith(s.fieldTransforms.map(g=>g.field))}(n,e,t,r):function(s,a,c){return ho(s.precondition,a)?(a.convertToNoDocument(a.version).setHasLocalMutations(),null):c}(n,e,t)}function $p(n,e){return n.type===e.type&&!!n.key.isEqual(e.key)&&!!n.precondition.isEqual(e.precondition)&&!!function(r,i){return r===void 0&&i===void 0||!(!r||!i)&&tr(r,i,(s,a)=>LE(s,a))}(n.fieldTransforms,e.fieldTransforms)&&(n.type===0?n.value.isEqual(e.value):n.type!==1||n.data.isEqual(e.data)&&n.fieldMask.isEqual(e.fieldMask))}var Pn=class extends mr{constructor(e,t,r,i=[]){super(),this.key=e,this.value=t,this.precondition=r,this.fieldTransforms=i,this.type=0}getFieldMask(){return null}},Ht=class extends mr{constructor(e,t,r,i,s=[]){super(),this.key=e,this.data=t,this.fieldMask=r,this.precondition=i,this.fieldTransforms=s,this.type=1}getFieldMask(){return this.fieldMask}};function ig(n){let e=new Map;return n.fieldMask.fields.forEach(t=>{if(!t.isEmpty()){let r=n.data.field(t);e.set(t,r)}}),e}function Kp(n,e,t){let r=new Map;U(n.length===t.length);for(let i=0;i<t.length;i++){let s=n[i],a=s.transform,c=e.data.field(s.field);r.set(s.field,xE(a,c,t[i]))}return r}function Gp(n,e,t){let r=new Map;for(let i of n){let s=i.transform,a=t.data.field(i.field);r.set(i.field,OE(s,a,e))}return r}var Ci=class extends mr{constructor(e,t){super(),this.key=e,this.precondition=t,this.type=2,this.fieldTransforms=[]}getFieldMask(){return null}},No=class extends mr{constructor(e,t){super(),this.key=e,this.precondition=t,this.type=3,this.fieldTransforms=[]}getFieldMask(){return null}};var Di=class{constructor(e,t,r,i){this.batchId=e,this.localWriteTime=t,this.baseMutations=r,this.mutations=i}applyToRemoteDocument(e,t){let r=t.mutationResults;for(let i=0;i<this.mutations.length;i++){let s=this.mutations[i];s.key.isEqual(e.key)&&ME(s,e,r[i])}}applyToLocalView(e,t){for(let r of this.baseMutations)r.key.isEqual(e.key)&&(t=wi(r,e,t,this.localWriteTime));for(let r of this.mutations)r.key.isEqual(e.key)&&(t=wi(r,e,t,this.localWriteTime));return t}applyToLocalDocumentSet(e,t){let r=Zm();return this.mutations.forEach(i=>{let s=e.get(i.key),a=s.overlayedDocument,c=this.applyToLocalView(a,s.mutatedFields);c=t.has(i.key)?null:c;let u=rg(a,c);u!==null&&r.set(i.key,u),a.isValidDocument()||a.convertToNoDocument(Q.min())}),r}keys(){return this.mutations.reduce((e,t)=>e.add(t.key),we())}isEqual(e){return this.batchId===e.batchId&&tr(this.mutations,e.mutations,(t,r)=>$p(t,r))&&tr(this.baseMutations,e.baseMutations,(t,r)=>$p(t,r))}},Uu=class n{constructor(e,t,r,i){this.batch=e,this.commitVersion=t,this.mutationResults=r,this.docVersions=i}static from(e,t,r){U(e.mutations.length===r.length);let i=function(){return RE}(),s=e.mutations;for(let a=0;a<s.length;a++)i=i.insert(s[a].key,r[a].version);return new n(e,t,r,i)}};var Ni=class{constructor(e,t){this.largestBatchId=e,this.mutation=t}getKey(){return this.mutation.key}isEqual(e){return e!==null&&this.mutation===e.mutation}toString(){return`Overlay{
      largestBatchId: ${this.largestBatchId},
      mutation: ${this.mutation.toString()}
    }`}};var ce,G;function FE(n){switch(n){case P.OK:return F();case P.CANCELLED:case P.UNKNOWN:case P.DEADLINE_EXCEEDED:case P.RESOURCE_EXHAUSTED:case P.INTERNAL:case P.UNAVAILABLE:case P.UNAUTHENTICATED:return!1;case P.INVALID_ARGUMENT:case P.NOT_FOUND:case P.ALREADY_EXISTS:case P.PERMISSION_DENIED:case P.FAILED_PRECONDITION:case P.ABORTED:case P.OUT_OF_RANGE:case P.UNIMPLEMENTED:case P.DATA_LOSS:return!0;default:return F()}}function UE(n){if(n===void 0)return je("GRPC error has no .code"),P.UNKNOWN;switch(n){case ce.OK:return P.OK;case ce.CANCELLED:return P.CANCELLED;case ce.UNKNOWN:return P.UNKNOWN;case ce.DEADLINE_EXCEEDED:return P.DEADLINE_EXCEEDED;case ce.RESOURCE_EXHAUSTED:return P.RESOURCE_EXHAUSTED;case ce.INTERNAL:return P.INTERNAL;case ce.UNAVAILABLE:return P.UNAVAILABLE;case ce.UNAUTHENTICATED:return P.UNAUTHENTICATED;case ce.INVALID_ARGUMENT:return P.INVALID_ARGUMENT;case ce.NOT_FOUND:return P.NOT_FOUND;case ce.ALREADY_EXISTS:return P.ALREADY_EXISTS;case ce.PERMISSION_DENIED:return P.PERMISSION_DENIED;case ce.FAILED_PRECONDITION:return P.FAILED_PRECONDITION;case ce.ABORTED:return P.ABORTED;case ce.OUT_OF_RANGE:return P.OUT_OF_RANGE;case ce.UNIMPLEMENTED:return P.UNIMPLEMENTED;case ce.DATA_LOSS:return P.DATA_LOSS;default:return F()}}(G=ce||(ce={}))[G.OK=0]="OK",G[G.CANCELLED=1]="CANCELLED",G[G.UNKNOWN=2]="UNKNOWN",G[G.INVALID_ARGUMENT=3]="INVALID_ARGUMENT",G[G.DEADLINE_EXCEEDED=4]="DEADLINE_EXCEEDED",G[G.NOT_FOUND=5]="NOT_FOUND",G[G.ALREADY_EXISTS=6]="ALREADY_EXISTS",G[G.PERMISSION_DENIED=7]="PERMISSION_DENIED",G[G.UNAUTHENTICATED=16]="UNAUTHENTICATED",G[G.RESOURCE_EXHAUSTED=8]="RESOURCE_EXHAUSTED",G[G.FAILED_PRECONDITION=9]="FAILED_PRECONDITION",G[G.ABORTED=10]="ABORTED",G[G.OUT_OF_RANGE=11]="OUT_OF_RANGE",G[G.UNIMPLEMENTED=12]="UNIMPLEMENTED",G[G.INTERNAL=13]="INTERNAL",G[G.UNAVAILABLE=14]="UNAVAILABLE",G[G.DATA_LOSS=15]="DATA_LOSS";var LR=new eo([4294967295,4294967295],0);var BE={asc:"ASCENDING",desc:"DESCENDING"},qE={"<":"LESS_THAN","<=":"LESS_THAN_OR_EQUAL",">":"GREATER_THAN",">=":"GREATER_THAN_OR_EQUAL","==":"EQUAL","!=":"NOT_EQUAL","array-contains":"ARRAY_CONTAINS",in:"IN","not-in":"NOT_IN","array-contains-any":"ARRAY_CONTAINS_ANY"},jE={and:"AND",or:"OR"},Bu=class{constructor(e,t){this.databaseId=e,this.useProto3Json=t}};function zE(n,e){return n.useProto3Json||ta(e)?e:{value:e}}function qu(n,e){return n.useProto3Json?`${new Date(1e3*e.seconds).toISOString().replace(/\.\d*/,"").replace("Z","")}.${("000000000"+e.nanoseconds).slice(-9)}Z`:{seconds:""+e.seconds,nanos:e.nanoseconds}}function $E(n,e){return qu(n,e.toTimestamp())}function Ye(n){return U(!!n),Q.fromTimestamp(function(t){let r=jt(t);return new ke(r.seconds,r.nanos)}(n))}function sg(n,e){return ju(n,e).canonicalString()}function ju(n,e){let t=function(i){return new ae(["projects",i.projectId,"databases",i.database])}(n).child("documents");return e===void 0?t:t.child(e)}function og(n){let e=ae.fromString(n);return U(eb(e)),e}function Oo(n,e){return sg(n.databaseId,e.path)}function fo(n,e){let t=og(e);if(t.get(1)!==n.databaseId.projectId)throw new M(P.INVALID_ARGUMENT,"Tried to deserialize key from different project: "+t.get(1)+" vs "+n.databaseId.projectId);if(t.get(3)!==n.databaseId.database)throw new M(P.INVALID_ARGUMENT,"Tried to deserialize key from different database: "+t.get(3)+" vs "+n.databaseId.database);return new V(ug(t))}function ag(n,e){return sg(n.databaseId,e)}function cg(n){let e=og(n);return e.length===4?ae.emptyPath():ug(e)}function KE(n){return new ae(["projects",n.databaseId.projectId,"databases",n.databaseId.database]).canonicalString()}function ug(n){return U(n.length>4&&n.get(4)==="documents"),n.popFirst(5)}function Hp(n,e,t){return{name:Oo(n,e),fields:t.value.mapValue.fields}}function GE(n,e,t){let r=fo(n,e.name),i=Ye(e.updateTime),s=e.createTime?Ye(e.createTime):Q.min(),a=new st({mapValue:{fields:e.fields}}),c=ze.newFoundDocument(r,i,s,a);return t&&c.setHasCommittedMutations(),t?c.setHasCommittedMutations():c}function xo(n,e){let t;if(e instanceof Pn)t={update:Hp(n,e.key,e.value)};else if(e instanceof Ci)t={delete:Oo(n,e.key)};else if(e instanceof Ht)t={update:Hp(n,e.key,e.data),updateMask:ZE(e.fieldMask)};else{if(!(e instanceof No))return F();t={verify:Oo(n,e.key)}}return e.fieldTransforms.length>0&&(t.updateTransforms=e.fieldTransforms.map(r=>function(s,a){let c=a.transform;if(c instanceof Sn)return{fieldPath:a.field.canonicalString(),setToServerValue:"REQUEST_TIME"};if(c instanceof Kt)return{fieldPath:a.field.canonicalString(),appendMissingElements:{values:c.elements}};if(c instanceof Gt)return{fieldPath:a.field.canonicalString(),removeAllFromArray:{values:c.elements}};if(c instanceof Rn)return{fieldPath:a.field.canonicalString(),increment:c.Ie};throw F()}(0,r))),e.precondition.isNone||(t.currentDocument=function(i,s){return s.updateTime!==void 0?{updateTime:$E(i,s.updateTime)}:s.exists!==void 0?{exists:s.exists}:F()}(n,e.precondition)),t}function zu(n,e){let t=e.currentDocument?function(s){return s.updateTime!==void 0?bt.updateTime(Ye(s.updateTime)):s.exists!==void 0?bt.exists(s.exists):bt.none()}(e.currentDocument):bt.none(),r=e.updateTransforms?e.updateTransforms.map(i=>function(a,c){let u=null;if("setToServerValue"in c)U(c.setToServerValue==="REQUEST_TIME"),u=new Sn;else if("appendMissingElements"in c){let f=c.appendMissingElements.values||[];u=new Kt(f)}else if("removeAllFromArray"in c){let f=c.removeAllFromArray.values||[];u=new Gt(f)}else"increment"in c?u=new Rn(a,c.increment):F();let d=Se.fromServerFormat(c.fieldPath);return new Mu(d,u)}(n,i)):[];if(e.update){e.update.name;let i=fo(n,e.update.name),s=new st({mapValue:{fields:e.update.fields}});if(e.updateMask){let a=function(u){let d=u.fieldPaths||[];return new Ut(d.map(f=>Se.fromServerFormat(f)))}(e.updateMask);return new Ht(i,s,a,t,r)}return new Pn(i,s,t,r)}if(e.delete){let i=fo(n,e.delete);return new Ci(i,t)}if(e.verify){let i=fo(n,e.verify);return new No(i,t)}return F()}function HE(n,e){return n&&n.length>0?(U(e!==void 0),n.map(t=>function(i,s){let a=i.updateTime?Ye(i.updateTime):Ye(s);return a.isEqual(Q.min())&&(a=Ye(s)),new Fu(a,i.transformResults||[])}(t,e))):[]}function WE(n,e){return{documents:[ag(n,e.path)]}}function QE(n,e){let t={structuredQuery:{}},r=e.path,i;e.collectionGroup!==null?(i=r,t.structuredQuery.from=[{collectionId:e.collectionGroup,allDescendants:!0}]):(i=r.popLast(),t.structuredQuery.from=[{collectionId:r.lastSegment()}]),t.parent=ag(n,i);let s=function(d){if(d.length!==0)return dg(J.create(d,"and"))}(e.filters);s&&(t.structuredQuery.where=s);let a=function(d){if(d.length!==0)return d.map(f=>function(b){return{field:Yn(b.field),direction:YE(b.dir)}}(f))}(e.orderBy);a&&(t.structuredQuery.orderBy=a);let c=zE(n,e.limit);return c!==null&&(t.structuredQuery.limit=c),e.startAt&&(t.structuredQuery.startAt=function(d){return{before:d.inclusive,values:d.position}}(e.startAt)),e.endAt&&(t.structuredQuery.endAt=function(d){return{before:!d.inclusive,values:d.position}}(e.endAt)),{ht:t,parent:i}}function lg(n){let e=cg(n.parent),t=n.structuredQuery,r=t.from?t.from.length:0,i=null;if(r>0){U(r===1);let f=t.from[0];f.allDescendants?i=f.collectionId:e=e.child(f.collectionId)}let s=[];t.where&&(s=function(g){let b=hg(g);return b instanceof J&&Jl(b)?b.getFilters():[b]}(t.where));let a=[];t.orderBy&&(a=function(g){return g.map(b=>function(k){return new hr(Jn(k.field),function(N){switch(N){case"ASCENDING":return"asc";case"DESCENDING":return"desc";default:return}}(k.direction))}(b))}(t.orderBy));let c=null;t.limit&&(c=function(g){let b;return b=typeof g=="object"?g.value:g,ta(b)?null:b}(t.limit));let u=null;t.startAt&&(u=function(g){let b=!!g.before,R=g.values||[];return new $t(R,b)}(t.startAt));let d=null;return t.endAt&&(d=function(g){let b=!g.before,R=g.values||[];return new $t(R,b)}(t.endAt)),wE(e,i,a,s,c,"F",u,d)}function hg(n){return n.unaryFilter!==void 0?function(t){switch(t.unaryFilter.op){case"IS_NAN":let r=Jn(t.unaryFilter.field);return K.create(r,"==",{doubleValue:NaN});case"IS_NULL":let i=Jn(t.unaryFilter.field);return K.create(i,"==",{nullValue:"NULL_VALUE"});case"IS_NOT_NAN":let s=Jn(t.unaryFilter.field);return K.create(s,"!=",{doubleValue:NaN});case"IS_NOT_NULL":let a=Jn(t.unaryFilter.field);return K.create(a,"!=",{nullValue:"NULL_VALUE"});default:return F()}}(n):n.fieldFilter!==void 0?function(t){return K.create(Jn(t.fieldFilter.field),function(i){switch(i){case"EQUAL":return"==";case"NOT_EQUAL":return"!=";case"GREATER_THAN":return">";case"GREATER_THAN_OR_EQUAL":return">=";case"LESS_THAN":return"<";case"LESS_THAN_OR_EQUAL":return"<=";case"ARRAY_CONTAINS":return"array-contains";case"IN":return"in";case"NOT_IN":return"not-in";case"ARRAY_CONTAINS_ANY":return"array-contains-any";default:return F()}}(t.fieldFilter.op),t.fieldFilter.value)}(n):n.compositeFilter!==void 0?function(t){return J.create(t.compositeFilter.filters.map(r=>hg(r)),function(i){switch(i){case"AND":return"and";case"OR":return"or";default:return F()}}(t.compositeFilter.op))}(n):F()}function YE(n){return BE[n]}function JE(n){return qE[n]}function XE(n){return jE[n]}function Yn(n){return{fieldPath:n.canonicalString()}}function Jn(n){return Se.fromServerFormat(n.fieldPath)}function dg(n){return n instanceof K?function(t){if(t.op==="=="){if(Vp(t.value))return{unaryFilter:{field:Yn(t.field),op:"IS_NAN"}};if(xp(t.value))return{unaryFilter:{field:Yn(t.field),op:"IS_NULL"}}}else if(t.op==="!="){if(Vp(t.value))return{unaryFilter:{field:Yn(t.field),op:"IS_NOT_NAN"}};if(xp(t.value))return{unaryFilter:{field:Yn(t.field),op:"IS_NOT_NULL"}}}return{fieldFilter:{field:Yn(t.field),op:JE(t.op),value:t.value}}}(n):n instanceof J?function(t){let r=t.getFilters().map(i=>dg(i));return r.length===1?r[0]:{compositeFilter:{op:XE(t.op),filters:r}}}(n):F()}function ZE(n){let e=[];return n.fields.forEach(t=>e.push(t.canonicalString())),{fieldPaths:e}}function eb(n){return n.length>=4&&n.get(0)==="projects"&&n.get(2)==="databases"}var $u=class n{constructor(e,t,r,i,s=Q.min(),a=Q.min(),c=Je.EMPTY_BYTE_STRING,u=null){this.target=e,this.targetId=t,this.purpose=r,this.sequenceNumber=i,this.snapshotVersion=s,this.lastLimboFreeSnapshotVersion=a,this.resumeToken=c,this.expectedCount=u}withSequenceNumber(e){return new n(this.target,this.targetId,this.purpose,e,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,this.expectedCount)}withResumeToken(e,t){return new n(this.target,this.targetId,this.purpose,this.sequenceNumber,t,this.lastLimboFreeSnapshotVersion,e,null)}withExpectedCount(e){return new n(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,e)}withLastLimboFreeSnapshotVersion(e){return new n(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,e,this.resumeToken,this.expectedCount)}};var Vo=class{constructor(e){this.Tt=e}};function tb(n,e){let t;if(e.document)t=GE(n.Tt,e.document,!!e.hasCommittedMutations);else if(e.noDocument){let r=V.fromSegments(e.noDocument.path),i=Cn(e.noDocument.readTime);t=ze.newNoDocument(r,i),e.hasCommittedMutations&&t.setHasCommittedMutations()}else{if(!e.unknownDocument)return F();{let r=V.fromSegments(e.unknownDocument.path),i=Cn(e.unknownDocument.version);t=ze.newUnknownDocument(r,i)}}return e.readTime&&t.setReadTime(function(i){let s=new ke(i[0],i[1]);return Q.fromTimestamp(s)}(e.readTime)),t}function Wp(n,e){let t=e.key,r={prefixPath:t.getCollectionPath().popLast().toArray(),collectionGroup:t.collectionGroup,documentId:t.path.lastSegment(),readTime:Lo(e.readTime),hasCommittedMutations:e.hasCommittedMutations};if(e.isFoundDocument())r.document=function(s,a){return{name:Oo(s,a.key),fields:a.data.value.mapValue.fields,updateTime:qu(s,a.version.toTimestamp()),createTime:qu(s,a.createTime.toTimestamp())}}(n.Tt,e);else if(e.isNoDocument())r.noDocument={path:t.path.toArray(),readTime:kn(e.version)};else{if(!e.isUnknownDocument())return F();r.unknownDocument={path:t.path.toArray(),version:kn(e.version)}}return r}function Lo(n){let e=n.toTimestamp();return[e.seconds,e.nanoseconds]}function kn(n){let e=n.toTimestamp();return{seconds:e.seconds,nanoseconds:e.nanoseconds}}function Cn(n){let e=new ke(n.seconds,n.nanoseconds);return Q.fromTimestamp(e)}function gn(n,e){let t=(e.baseMutations||[]).map(s=>zu(n.Tt,s));for(let s=0;s<e.mutations.length-1;++s){let a=e.mutations[s];if(s+1<e.mutations.length&&e.mutations[s+1].transform!==void 0){let c=e.mutations[s+1];a.updateTransforms=c.transform.fieldTransforms,e.mutations.splice(s+1,1),++s}}let r=e.mutations.map(s=>zu(n.Tt,s)),i=ke.fromMillis(e.localWriteTimeMs);return new Di(e.batchId,i,t,r)}function pi(n){let e=Cn(n.readTime),t=n.lastLimboFreeSnapshotVersion!==void 0?Cn(n.lastLimboFreeSnapshotVersion):Q.min(),r;return r=function(s){return s.documents!==void 0}(n.query)?function(s){return U(s.documents.length===1),At(vE(cg(s.documents[0])))}(n.query):function(s){return At(lg(s))}(n.query),new $u(r,n.targetId,"TargetPurposeListen",n.lastListenSequenceNumber,e,t,Je.fromBase64String(n.resumeToken))}function fg(n,e){let t=kn(e.snapshotVersion),r=kn(e.lastLimboFreeSnapshotVersion),i;i=yE(e.target)?WE(n.Tt,e.target):QE(n.Tt,e.target).ht;let s=e.resumeToken.toBase64();return{targetId:e.targetId,canonicalId:An(e.target),readTime:t,resumeToken:s,lastListenSequenceNumber:e.sequenceNumber,lastLimboFreeSnapshotVersion:r,query:i}}function pg(n){let e=lg({parent:n.parent,structuredQuery:n.structuredQuery});return n.limitType==="LAST"?Lu(e,e.limit,"L"):e}function iu(n,e){return new Ni(e.largestBatchId,zu(n.Tt,e.overlayMutation))}function Qp(n,e){let t=e.path.lastSegment();return[n,Ce(e.path.popLast()),t]}function Yp(n,e,t,r){return{indexId:n,uid:e,sequenceNumber:t,readTime:kn(r.readTime),documentKey:Ce(r.documentKey.path),largestBatchId:r.largestBatchId}}var Ku=class{getBundleMetadata(e,t){return Jp(e).get(t).next(r=>{if(r)return function(s){return{id:s.bundleId,createTime:Cn(s.createTime),version:s.version}}(r)})}saveBundleMetadata(e,t){return Jp(e).put(function(i){return{bundleId:i.id,createTime:kn(Ye(i.createTime)),version:i.version}}(t))}getNamedQuery(e,t){return Xp(e).get(t).next(r=>{if(r)return function(s){return{name:s.name,query:pg(s.bundledQuery),readTime:Cn(s.readTime)}}(r)})}saveNamedQuery(e,t){return Xp(e).put(function(i){return{name:i.name,readTime:kn(Ye(i.readTime)),bundledQuery:i.bundledQuery}}(t))}};function Jp(n){return fe(n,na)}function Xp(n){return fe(n,ra)}var Mo=class n{constructor(e,t){this.serializer=e,this.userId=t}static It(e,t){let r=t.uid||"";return new n(e,r)}getOverlay(e,t){return li(e).get(Qp(this.userId,t)).next(r=>r?iu(this.serializer,r):null)}getOverlays(e,t){let r=at();return A.forEach(t,i=>this.getOverlay(e,i).next(s=>{s!==null&&r.set(i,s)})).next(()=>r)}saveOverlays(e,t,r){let i=[];return r.forEach((s,a)=>{let c=new Ni(t,a);i.push(this.Et(e,c))}),A.waitFor(i)}removeOverlaysForBatchId(e,t,r){let i=new Set;t.forEach(a=>i.add(Ce(a.getCollectionPath())));let s=[];return i.forEach(a=>{let c=IDBKeyRange.bound([this.userId,a,r],[this.userId,a,r+1],!1,!0);s.push(li(e).J(Tu,c))}),A.waitFor(s)}getOverlaysForCollection(e,t,r){let i=at(),s=Ce(t),a=IDBKeyRange.bound([this.userId,s,r],[this.userId,s,Number.POSITIVE_INFINITY],!0);return li(e).G(Tu,a).next(c=>{for(let u of c){let d=iu(this.serializer,u);i.set(d.getKey(),d)}return i})}getOverlaysForCollectionGroup(e,t,r,i){let s=at(),a,c=IDBKeyRange.bound([this.userId,t,r],[this.userId,t,Number.POSITIVE_INFINITY],!0);return li(e).Z({index:Dm,range:c},(u,d,f)=>{let g=iu(this.serializer,d);s.size()<i||g.largestBatchId===a?(s.set(g.getKey(),g),a=g.largestBatchId):f.done()}).next(()=>s)}Et(e,t){return li(e).put(function(i,s,a){let[c,u,d]=Qp(s,a.mutation.key);return{userId:s,collectionPath:u,documentId:d,collectionGroup:a.mutation.key.getCollectionGroup(),largestBatchId:a.largestBatchId,overlayMutation:xo(i.Tt,a.mutation)}}(this.serializer,this.userId,t))}};function li(n){return fe(n,ia)}var Gu=class{dt(e){return fe(e,Gl)}getSessionToken(e){return this.dt(e).get("sessionToken").next(t=>{let r=t?.value;return r?Je.fromUint8Array(r):Je.EMPTY_BYTE_STRING})}setSessionToken(e,t){return this.dt(e).put({name:"sessionToken",value:t.toUint8Array()})}};var Et=class{constructor(){}At(e,t){this.Rt(e,t),t.Vt()}Rt(e,t){if("nullValue"in e)this.ft(t,5);else if("booleanValue"in e)this.ft(t,10),t.gt(e.booleanValue?1:0);else if("integerValue"in e)this.ft(t,15),t.gt(le(e.integerValue));else if("doubleValue"in e){let r=le(e.doubleValue);isNaN(r)?this.ft(t,13):(this.ft(t,15),vo(r)?t.gt(0):t.gt(r))}else if("timestampValue"in e){let r=e.timestampValue;this.ft(t,20),typeof r=="string"&&(r=jt(r)),t.yt(`${r.seconds||""}`),t.gt(r.nanos||0)}else if("stringValue"in e)this.wt(e.stringValue,t),this.St(t);else if("bytesValue"in e)this.ft(t,30),t.bt(cr(e.bytesValue)),this.St(t);else if("referenceValue"in e)this.Dt(e.referenceValue,t);else if("geoPointValue"in e){let r=e.geoPointValue;this.ft(t,45),t.gt(r.latitude||0),t.gt(r.longitude||0)}else"mapValue"in e?zm(e)?this.ft(t,Number.MAX_SAFE_INTEGER):sa(e)?this.vt(e.mapValue,t):(this.Ct(e.mapValue,t),this.St(t)):"arrayValue"in e?(this.Ft(e.arrayValue,t),this.St(t)):F()}wt(e,t){this.ft(t,25),this.Mt(e,t)}Mt(e,t){t.yt(e)}Ct(e,t){let r=e.fields||{};this.ft(t,55);for(let i of Object.keys(r))this.wt(i,t),this.Rt(r[i],t)}vt(e,t){var r,i;let s=e.fields||{};this.ft(t,53);let a=Po,c=((i=(r=s[a].arrayValue)===null||r===void 0?void 0:r.values)===null||i===void 0?void 0:i.length)||0;this.ft(t,15),t.gt(le(c)),this.wt(a,t),this.Rt(s[a],t)}Ft(e,t){let r=e.values||[];this.ft(t,50);for(let i of r)this.Rt(i,t)}Dt(e,t){this.ft(t,37),V.fromName(e).path.forEach(r=>{this.ft(t,60),this.Mt(r,t)})}ft(e,t){e.gt(t)}St(e){e.gt(2)}};Et.xt=new Et;var Kn=255;function nb(n){if(n===0)return 8;let e=0;return n>>4||(e+=4,n<<=4),n>>6||(e+=2,n<<=2),n>>7||(e+=1),e}function Zp(n){let e=64-function(r){let i=0;for(let s=0;s<8;++s){let a=nb(255&r[s]);if(i+=a,a!==8)break}return i}(n);return Math.ceil(e/8)}var Hu=class{constructor(){this.buffer=new Uint8Array(1024),this.position=0}Ot(e){let t=e[Symbol.iterator](),r=t.next();for(;!r.done;)this.Nt(r.value),r=t.next();this.Bt()}Lt(e){let t=e[Symbol.iterator](),r=t.next();for(;!r.done;)this.kt(r.value),r=t.next();this.qt()}Qt(e){for(let t of e){let r=t.charCodeAt(0);if(r<128)this.Nt(r);else if(r<2048)this.Nt(960|r>>>6),this.Nt(128|63&r);else if(t<"\uD800"||"\uDBFF"<t)this.Nt(480|r>>>12),this.Nt(128|63&r>>>6),this.Nt(128|63&r);else{let i=t.codePointAt(0);this.Nt(240|i>>>18),this.Nt(128|63&i>>>12),this.Nt(128|63&i>>>6),this.Nt(128|63&i)}}this.Bt()}$t(e){for(let t of e){let r=t.charCodeAt(0);if(r<128)this.kt(r);else if(r<2048)this.kt(960|r>>>6),this.kt(128|63&r);else if(t<"\uD800"||"\uDBFF"<t)this.kt(480|r>>>12),this.kt(128|63&r>>>6),this.kt(128|63&r);else{let i=t.codePointAt(0);this.kt(240|i>>>18),this.kt(128|63&i>>>12),this.kt(128|63&i>>>6),this.kt(128|63&i)}}this.qt()}Kt(e){let t=this.Ut(e),r=Zp(t);this.Wt(1+r),this.buffer[this.position++]=255&r;for(let i=t.length-r;i<t.length;++i)this.buffer[this.position++]=255&t[i]}Gt(e){let t=this.Ut(e),r=Zp(t);this.Wt(1+r),this.buffer[this.position++]=~(255&r);for(let i=t.length-r;i<t.length;++i)this.buffer[this.position++]=~(255&t[i])}zt(){this.jt(Kn),this.jt(255)}Ht(){this.Jt(Kn),this.Jt(255)}reset(){this.position=0}seed(e){this.Wt(e.length),this.buffer.set(e,this.position),this.position+=e.length}Yt(){return this.buffer.slice(0,this.position)}Ut(e){let t=function(s){let a=new DataView(new ArrayBuffer(8));return a.setFloat64(0,s,!1),new Uint8Array(a.buffer)}(e),r=!!(128&t[0]);t[0]^=r?255:128;for(let i=1;i<t.length;++i)t[i]^=r?255:0;return t}Nt(e){let t=255&e;t===0?(this.jt(0),this.jt(255)):t===Kn?(this.jt(Kn),this.jt(0)):this.jt(t)}kt(e){let t=255&e;t===0?(this.Jt(0),this.Jt(255)):t===Kn?(this.Jt(Kn),this.Jt(0)):this.Jt(e)}Bt(){this.jt(0),this.jt(1)}qt(){this.Jt(0),this.Jt(1)}jt(e){this.Wt(1),this.buffer[this.position++]=e}Jt(e){this.Wt(1),this.buffer[this.position++]=~e}Wt(e){let t=e+this.position;if(t<=this.buffer.length)return;let r=2*this.buffer.length;r<t&&(r=t);let i=new Uint8Array(r);i.set(this.buffer),this.buffer=i}},Wu=class{constructor(e){this.Zt=e}bt(e){this.Zt.Ot(e)}yt(e){this.Zt.Qt(e)}gt(e){this.Zt.Kt(e)}Vt(){this.Zt.zt()}},Qu=class{constructor(e){this.Zt=e}bt(e){this.Zt.Lt(e)}yt(e){this.Zt.$t(e)}gt(e){this.Zt.Gt(e)}Vt(){this.Zt.Ht()}},_n=class{constructor(){this.Zt=new Hu,this.Xt=new Wu(this.Zt),this.en=new Qu(this.Zt)}seed(e){this.Zt.seed(e)}tn(e){return e===0?this.Xt:this.en}Yt(){return this.Zt.Yt()}reset(){this.Zt.reset()}};var yn=class n{constructor(e,t,r,i){this.indexId=e,this.documentKey=t,this.arrayValue=r,this.directionalValue=i}nn(){let e=this.directionalValue.length,t=e===0||this.directionalValue[e-1]===255?e+1:e,r=new Uint8Array(t);return r.set(this.directionalValue,0),t!==e?r.set([0],this.directionalValue.length):++r[r.length-1],new n(this.indexId,this.documentKey,this.arrayValue,r)}};function Vt(n,e){let t=n.indexId-e.indexId;return t!==0?t:(t=em(n.arrayValue,e.arrayValue),t!==0?t:(t=em(n.directionalValue,e.directionalValue),t!==0?t:V.comparator(n.documentKey,e.documentKey)))}function em(n,e){for(let t=0;t<n.length&&t<e.length;++t){let r=n[t]-e[t];if(r!==0)return r}return n.length-e.length}var Fo=class{constructor(e){this.rn=new Z((t,r)=>Se.comparator(t.field,r.field)),this.collectionId=e.collectionGroup!=null?e.collectionGroup:e.path.lastSegment(),this.sn=e.orderBy,this._n=[];for(let t of e.filters){let r=t;r.isInequality()?this.rn=this.rn.add(r):this._n.push(r)}}get an(){return this.rn.size>1}un(e){if(U(e.collectionGroup===this.collectionId),this.an)return!1;let t=mu(e);if(t!==void 0&&!this.cn(t))return!1;let r=fn(e),i=new Set,s=0,a=0;for(;s<r.length&&this.cn(r[s]);++s)i=i.add(r[s].fieldPath.canonicalString());if(s===r.length)return!0;if(this.rn.size>0){let c=this.rn.getIterator().getNext();if(!i.has(c.field.canonicalString())){let u=r[s];if(!this.ln(c,u)||!this.hn(this.sn[a++],u))return!1}++s}for(;s<r.length;++s){let c=r[s];if(a>=this.sn.length||!this.hn(this.sn[a++],c))return!1}return!0}Pn(){if(this.an)return null;let e=new Z(Se.comparator),t=[];for(let r of this._n)if(!r.field.isKeyField())if(r.op==="array-contains"||r.op==="array-contains-any")t.push(new er(r.field,2));else{if(e.has(r.field))continue;e=e.add(r.field),t.push(new er(r.field,0))}for(let r of this.sn)r.field.isKeyField()||e.has(r.field)||(e=e.add(r.field),t.push(new er(r.field,r.dir==="asc"?0:1)));return new nr(nr.UNKNOWN_ID,this.collectionId,t,Ii.empty())}cn(e){for(let t of this._n)if(this.ln(t,e))return!0;return!1}ln(e,t){if(e===void 0||!e.field.isEqual(t.fieldPath))return!1;let r=e.op==="array-contains"||e.op==="array-contains-any";return t.kind===2===r}hn(e,t){return!!e.field.isEqual(t.fieldPath)&&(t.kind===0&&e.dir==="asc"||t.kind===1&&e.dir==="desc")}};function mg(n){var e,t;if(U(n instanceof K||n instanceof J),n instanceof K){if(n instanceof Co){let i=((t=(e=n.value.arrayValue)===null||e===void 0?void 0:e.values)===null||t===void 0?void 0:t.map(s=>K.create(n.field,"==",s)))||[];return J.create(i,"or")}return n}let r=n.filters.map(i=>mg(i));return J.create(r,n.op)}function rb(n){if(n.getFilters().length===0)return[];let e=Xu(mg(n));return U(gg(e)),Yu(e)||Ju(e)?[e]:e.getFilters()}function Yu(n){return n instanceof K}function Ju(n){return n instanceof J&&Jl(n)}function gg(n){return Yu(n)||Ju(n)||function(t){if(t instanceof J&&Su(t)){for(let r of t.getFilters())if(!Yu(r)&&!Ju(r))return!1;return!0}return!1}(n)}function Xu(n){if(U(n instanceof K||n instanceof J),n instanceof K)return n;if(n.filters.length===1)return Xu(n.filters[0]);let e=n.filters.map(r=>Xu(r)),t=J.create(e,n.op);return t=Uo(t),gg(t)?t:(U(t instanceof J),U(dr(t)),U(t.filters.length>1),t.filters.reduce((r,i)=>Xl(r,i)))}function Xl(n,e){let t;return U(n instanceof K||n instanceof J),U(e instanceof K||e instanceof J),t=n instanceof K?e instanceof K?function(i,s){return J.create([i,s],"and")}(n,e):tm(n,e):e instanceof K?tm(e,n):function(i,s){if(U(i.filters.length>0&&s.filters.length>0),dr(i)&&dr(s))return Hm(i,s.getFilters());let a=Su(i)?i:s,c=Su(i)?s:i,u=a.filters.map(d=>Xl(d,c));return J.create(u,"or")}(n,e),Uo(t)}function tm(n,e){if(dr(e))return Hm(e,n.getFilters());{let t=e.filters.map(r=>Xl(n,r));return J.create(t,"or")}}function Uo(n){if(U(n instanceof K||n instanceof J),n instanceof K)return n;let e=n.getFilters();if(e.length===1)return Uo(e[0]);if(Km(n))return n;let t=e.map(i=>Uo(i)),r=[];return t.forEach(i=>{i instanceof K?r.push(i):i instanceof J&&(i.op===n.op?r.push(...i.filters):r.push(i))}),r.length===1?r[0]:J.create(r,n.op)}var Zu=class{constructor(){this.Tn=new Oi}addToCollectionParentIndex(e,t){return this.Tn.add(t),A.resolve()}getCollectionParents(e,t){return A.resolve(this.Tn.getEntries(t))}addFieldIndex(e,t){return A.resolve()}deleteFieldIndex(e,t){return A.resolve()}deleteAllFieldIndexes(e){return A.resolve()}createTargetIndexes(e,t){return A.resolve()}getDocumentsMatchingTarget(e,t){return A.resolve(null)}getIndexType(e,t){return A.resolve(0)}getFieldIndexes(e,t){return A.resolve([])}getNextCollectionGroupToUpdate(e){return A.resolve(null)}getMinOffset(e,t){return A.resolve($e.min())}getMinOffsetFromCollectionGroup(e,t){return A.resolve($e.min())}updateCollectionGroup(e,t,r){return A.resolve()}updateIndexEntries(e,t){return A.resolve()}},Oi=class{constructor(){this.index={}}add(e){let t=e.lastSegment(),r=e.popLast(),i=this.index[t]||new Z(ae.comparator),s=!i.has(r);return this.index[t]=i.add(r),s}has(e){let t=e.lastSegment(),r=e.popLast(),i=this.index[t];return i&&i.has(r)}getEntries(e){return(this.index[e]||new Z(ae.comparator)).toArray()}};var nm="IndexedDbIndexManager",io=new Uint8Array(0),el=class{constructor(e,t){this.databaseId=t,this.In=new Oi,this.En=new lt(r=>An(r),(r,i)=>Fi(r,i)),this.uid=e.uid||""}addToCollectionParentIndex(e,t){if(!this.In.has(t)){let r=t.lastSegment(),i=t.popLast();e.addOnCommittedListener(()=>{this.In.add(t)});let s={collectionId:r,parent:Ce(i)};return rm(e).put(s)}return A.resolve()}getCollectionParents(e,t){let r=[],i=IDBKeyRange.bound([t,""],[Tm(t),""],!1,!0);return rm(e).G(i).next(s=>{for(let a of s){if(a.collectionId!==t)break;r.push(ot(a.parent))}return r})}addFieldIndex(e,t){let r=hi(e),i=function(c){return{indexId:c.indexId,collectionGroup:c.collectionGroup,fields:c.fields.map(u=>[u.fieldPath.canonicalString(),u.kind])}}(t);delete i.indexId;let s=r.add(i);if(t.indexState){let a=Hn(e);return s.next(c=>{a.put(Yp(c,this.uid,t.indexState.sequenceNumber,t.indexState.offset))})}return s.next()}deleteFieldIndex(e,t){let r=hi(e),i=Hn(e),s=Gn(e);return r.delete(t.indexId).next(()=>i.delete(IDBKeyRange.bound([t.indexId],[t.indexId+1],!1,!0))).next(()=>s.delete(IDBKeyRange.bound([t.indexId],[t.indexId+1],!1,!0)))}deleteAllFieldIndexes(e){let t=hi(e),r=Gn(e),i=Hn(e);return t.J().next(()=>r.J()).next(()=>i.J())}createTargetIndexes(e,t){return A.forEach(this.dn(t),r=>this.getIndexType(e,r).next(i=>{if(i===0||i===1){let s=new Fo(r).Pn();if(s!=null)return this.addFieldIndex(e,s)}}))}getDocumentsMatchingTarget(e,t){let r=Gn(e),i=!0,s=new Map;return A.forEach(this.dn(t),a=>this.An(e,a).next(c=>{i&&(i=!!c),s.set(a,c)})).next(()=>{if(i){let a=we(),c=[];return A.forEach(s,(u,d)=>{D(nm,`Using index ${function(L){return`id=${L.indexId}|cg=${L.collectionGroup}|f=${L.fields.map(B=>`${B.fieldPath}:${B.kind}`).join(",")}`}(u)} to execute ${An(t)}`);let f=function(L,B){let H=mu(B);if(H===void 0)return null;for(let q of Do(L,H.fieldPath))switch(q.op){case"array-contains-any":return q.value.arrayValue.values||[];case"array-contains":return[q.value]}return null}(d,u),g=function(L,B){let H=new Map;for(let q of fn(B))for(let w of Do(L,q.fieldPath))switch(w.op){case"==":case"in":H.set(q.fieldPath.canonicalString(),w.value);break;case"not-in":case"!=":return H.set(q.fieldPath.canonicalString(),w.value),Array.from(H.values())}return null}(d,u),b=function(L,B){let H=[],q=!0;for(let w of fn(B)){let m=w.kind===0?Bp(L,w.fieldPath,L.startAt):qp(L,w.fieldPath,L.startAt);H.push(m.value),q&&(q=m.inclusive)}return new $t(H,q)}(d,u),R=function(L,B){let H=[],q=!0;for(let w of fn(B)){let m=w.kind===0?qp(L,w.fieldPath,L.endAt):Bp(L,w.fieldPath,L.endAt);H.push(m.value),q&&(q=m.inclusive)}return new $t(H,q)}(d,u),k=this.Rn(u,d,b),O=this.Rn(u,d,R),N=this.Vn(u,d,g),Y=this.mn(u.indexId,f,k,b.inclusive,O,R.inclusive,N);return A.forEach(Y,z=>r.H(z,t.limit).next(L=>{L.forEach(B=>{let H=V.fromSegments(B.documentKey);a.has(H)||(a=a.add(H),c.push(H))})}))}).next(()=>c)}return A.resolve(null)})}dn(e){let t=this.En.get(e);return t||(e.filters.length===0?t=[e]:t=rb(J.create(e.filters,"and")).map(r=>Vu(e.path,e.collectionGroup,e.orderBy,r.getFilters(),e.limit,e.startAt,e.endAt)),this.En.set(e,t),t)}mn(e,t,r,i,s,a,c){let u=(t!=null?t.length:1)*Math.max(r.length,s.length),d=u/(t!=null?t.length:1),f=[];for(let g=0;g<u;++g){let b=t?this.fn(t[g/d]):io,R=this.gn(e,b,r[g%d],i),k=this.pn(e,b,s[g%d],a),O=c.map(N=>this.gn(e,b,N,!0));f.push(...this.createRange(R,k,O))}return f}gn(e,t,r,i){let s=new yn(e,V.empty(),t,r);return i?s:s.nn()}pn(e,t,r,i){let s=new yn(e,V.empty(),t,r);return i?s.nn():s}An(e,t){let r=new Fo(t),i=t.collectionGroup!=null?t.collectionGroup:t.path.lastSegment();return this.getFieldIndexes(e,i).next(s=>{let a=null;for(let c of s)r.un(c)&&(!a||c.fields.length>a.fields.length)&&(a=c);return a})}getIndexType(e,t){let r=2,i=this.dn(t);return A.forEach(i,s=>this.An(e,s).next(a=>{a?r!==0&&a.fields.length<function(u){let d=new Z(Se.comparator),f=!1;for(let g of u.filters)for(let b of g.getFlattenedFilters())b.field.isKeyField()||(b.op==="array-contains"||b.op==="array-contains-any"?f=!0:d=d.add(b.field));for(let g of u.orderBy)g.field.isKeyField()||(d=d.add(g.field));return d.size+(f?1:0)}(s)&&(r=1):r=0})).next(()=>function(a){return a.limit!==null}(t)&&i.length>1&&r===2?1:r)}yn(e,t){let r=new _n;for(let i of fn(e)){let s=t.data.field(i.fieldPath);if(s==null)return null;let a=r.tn(i.kind);Et.xt.At(s,a)}return r.Yt()}fn(e){let t=new _n;return Et.xt.At(e,t.tn(0)),t.Yt()}wn(e,t){let r=new _n;return Et.xt.At(Yl(this.databaseId,t),r.tn(function(s){let a=fn(s);return a.length===0?0:a[a.length-1].kind}(e))),r.Yt()}Vn(e,t,r){if(r===null)return[];let i=[];i.push(new _n);let s=0;for(let a of fn(e)){let c=r[s++];for(let u of i)if(this.Sn(t,a.fieldPath)&&ki(c))i=this.bn(i,a,c);else{let d=u.tn(a.kind);Et.xt.At(c,d)}}return this.Dn(i)}Rn(e,t,r){return this.Vn(e,t,r.position)}Dn(e){let t=[];for(let r=0;r<e.length;++r)t[r]=e[r].Yt();return t}bn(e,t,r){let i=[...e],s=[];for(let a of r.arrayValue.values||[])for(let c of i){let u=new _n;u.seed(c.Yt()),Et.xt.At(a,u.tn(t.kind)),s.push(u)}return s}Sn(e,t){return!!e.filters.find(r=>r instanceof K&&r.field.isEqual(t)&&(r.op==="in"||r.op==="not-in"))}getFieldIndexes(e,t){let r=hi(e),i=Hn(e);return(t?r.G(Iu,IDBKeyRange.bound(t,t)):r.G()).next(s=>{let a=[];return A.forEach(s,c=>i.get([c.indexId,this.uid]).next(u=>{a.push(function(f,g){let b=g?new Ii(g.sequenceNumber,new $e(Cn(g.readTime),new V(ot(g.documentKey)),g.largestBatchId)):Ii.empty(),R=f.fields.map(([k,O])=>new er(Se.fromServerFormat(k),O));return new nr(f.indexId,f.collectionGroup,R,b)}(c,u))})).next(()=>a)})}getNextCollectionGroupToUpdate(e){return this.getFieldIndexes(e).next(t=>t.length===0?null:(t.sort((r,i)=>{let s=r.indexState.sequenceNumber-i.indexState.sequenceNumber;return s!==0?s:$(r.collectionGroup,i.collectionGroup)}),t[0].collectionGroup))}updateCollectionGroup(e,t,r){let i=hi(e),s=Hn(e);return this.vn(e).next(a=>i.G(Iu,IDBKeyRange.bound(t,t)).next(c=>A.forEach(c,u=>s.put(Yp(u.indexId,this.uid,a,r)))))}updateIndexEntries(e,t){let r=new Map;return A.forEach(t,(i,s)=>{let a=r.get(i.collectionGroup);return(a?A.resolve(a):this.getFieldIndexes(e,i.collectionGroup)).next(c=>(r.set(i.collectionGroup,c),A.forEach(c,u=>this.Cn(e,i,u).next(d=>{let f=this.Fn(s,u);return d.isEqual(f)?A.resolve():this.Mn(e,s,u,d,f)}))))})}xn(e,t,r,i){return Gn(e).put({indexId:i.indexId,uid:this.uid,arrayValue:i.arrayValue,directionalValue:i.directionalValue,orderedDocumentKey:this.wn(r,t.key),documentKey:t.key.path.toArray()})}On(e,t,r,i){return Gn(e).delete([i.indexId,this.uid,i.arrayValue,i.directionalValue,this.wn(r,t.key),t.key.path.toArray()])}Cn(e,t,r){let i=Gn(e),s=new Z(Vt);return i.Z({index:Cm,range:IDBKeyRange.only([r.indexId,this.uid,this.wn(r,t)])},(a,c)=>{s=s.add(new yn(r.indexId,t,c.arrayValue,c.directionalValue))}).next(()=>s)}Fn(e,t){let r=new Z(Vt),i=this.yn(t,e);if(i==null)return r;let s=mu(t);if(s!=null){let a=e.data.field(s.fieldPath);if(ki(a))for(let c of a.arrayValue.values||[])r=r.add(new yn(t.indexId,e.key,this.fn(c),i))}else r=r.add(new yn(t.indexId,e.key,io,i));return r}Mn(e,t,r,i,s){D(nm,"Updating index entries for document '%s'",t.key);let a=[];return function(u,d,f,g,b){let R=u.getIterator(),k=d.getIterator(),O=$n(R),N=$n(k);for(;O||N;){let Y=!1,z=!1;if(O&&N){let L=f(O,N);L<0?z=!0:L>0&&(Y=!0)}else O!=null?z=!0:Y=!0;Y?(g(N),N=$n(k)):z?(b(O),O=$n(R)):(O=$n(R),N=$n(k))}}(i,s,Vt,c=>{a.push(this.xn(e,t,r,c))},c=>{a.push(this.On(e,t,r,c))}),A.waitFor(a)}vn(e){let t=1;return Hn(e).Z({index:km,reverse:!0,range:IDBKeyRange.upperBound([this.uid,Number.MAX_SAFE_INTEGER])},(r,i,s)=>{s.done(),t=i.sequenceNumber+1}).next(()=>t)}createRange(e,t,r){r=r.sort((a,c)=>Vt(a,c)).filter((a,c,u)=>!c||Vt(a,u[c-1])!==0);let i=[];i.push(e);for(let a of r){let c=Vt(a,e),u=Vt(a,t);if(c===0)i[0]=e.nn();else if(c>0&&u<0)i.push(a),i.push(a.nn());else if(u>0)break}i.push(t);let s=[];for(let a=0;a<i.length;a+=2){if(this.Nn(i[a],i[a+1]))return[];let c=[i[a].indexId,this.uid,i[a].arrayValue,i[a].directionalValue,io,[]],u=[i[a+1].indexId,this.uid,i[a+1].arrayValue,i[a+1].directionalValue,io,[]];s.push(IDBKeyRange.bound(c,u))}return s}Nn(e,t){return Vt(e,t)>0}getMinOffsetFromCollectionGroup(e,t){return this.getFieldIndexes(e,t).next(im)}getMinOffset(e,t){return A.mapArray(this.dn(t),r=>this.An(e,r).next(i=>i||F())).next(im)}};function rm(n){return fe(n,bi)}function Gn(n){return fe(n,Ao)}function hi(n){return fe(n,Kl)}function Hn(n){return fe(n,bo)}function im(n){U(n.length!==0);let e=n[0].indexState.offset,t=e.largestBatchId;for(let r=1;r<n.length;r++){let i=n[r].indexState.offset;jl(i,e)<0&&(e=i),t<i.largestBatchId&&(t=i.largestBatchId)}return new $e(e.readTime,e.documentKey,t)}var sm={didRun:!1,sequenceNumbersCollected:0,targetsRemoved:0,documentsRemoved:0},_g=41943040,qe=class n{static withCacheSize(e){return new n(e,n.DEFAULT_COLLECTION_PERCENTILE,n.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT)}constructor(e,t,r){this.cacheSizeCollectionThreshold=e,this.percentileToCollect=t,this.maximumSequenceNumbersToCollect=r}};function yg(n,e,t){let r=n.store(Qe),i=n.store(ir),s=[],a=IDBKeyRange.only(t.batchId),c=0,u=r.Z({range:a},(f,g,b)=>(c++,b.delete()));s.push(u.next(()=>{U(c===1)}));let d=[];for(let f of t.mutations){let g=Sm(e,f.key.path,t.batchId);s.push(i.delete(g)),d.push(f.key)}return A.waitFor(s).next(()=>d)}function Bo(n){if(!n)return 0;let e;if(n.document)e=n.document;else if(n.unknownDocument)e=n.unknownDocument;else{if(!n.noDocument)throw F();e=n.noDocument}return JSON.stringify(e).length}qe.DEFAULT_COLLECTION_PERCENTILE=10,qe.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT=1e3,qe.DEFAULT=new qe(_g,qe.DEFAULT_COLLECTION_PERCENTILE,qe.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT),qe.DISABLED=new qe(-1,0,0);var qo=class n{constructor(e,t,r,i){this.userId=e,this.serializer=t,this.indexManager=r,this.referenceDelegate=i,this.Bn={}}static It(e,t,r,i){U(e.uid!=="");let s=e.isAuthenticated()?e.uid:"";return new n(s,t,r,i)}checkEmpty(e){let t=!0,r=IDBKeyRange.bound([this.userId,Number.NEGATIVE_INFINITY],[this.userId,Number.POSITIVE_INFINITY]);return Lt(e).Z({index:wn,range:r},(i,s,a)=>{t=!1,a.done()}).next(()=>t)}addMutationBatch(e,t,r,i){let s=Xn(e),a=Lt(e);return a.add({}).next(c=>{U(typeof c=="number");let u=new Di(c,t,r,i),d=function(R,k,O){let N=O.baseMutations.map(z=>xo(R.Tt,z)),Y=O.mutations.map(z=>xo(R.Tt,z));return{userId:k,batchId:O.batchId,localWriteTimeMs:O.localWriteTime.toMillis(),baseMutations:N,mutations:Y}}(this.serializer,this.userId,u),f=[],g=new Z((b,R)=>$(b.canonicalString(),R.canonicalString()));for(let b of i){let R=Sm(this.userId,b.key.path,c);g=g.add(b.key.path.popLast()),f.push(a.put(d)),f.push(s.put(R,zT))}return g.forEach(b=>{f.push(this.indexManager.addToCollectionParentIndex(e,b))}),e.addOnCommittedListener(()=>{this.Bn[c]=u.keys()}),A.waitFor(f).next(()=>u)})}lookupMutationBatch(e,t){return Lt(e).get(t).next(r=>r?(U(r.userId===this.userId),gn(this.serializer,r)):null)}Ln(e,t){return this.Bn[t]?A.resolve(this.Bn[t]):this.lookupMutationBatch(e,t).next(r=>{if(r){let i=r.keys();return this.Bn[t]=i,i}return null})}getNextMutationBatchAfterBatchId(e,t){let r=t+1,i=IDBKeyRange.lowerBound([this.userId,r]),s=null;return Lt(e).Z({index:wn,range:i},(a,c,u)=>{c.userId===this.userId&&(U(c.batchId>=r),s=gn(this.serializer,c)),u.done()}).next(()=>s)}getHighestUnacknowledgedBatchId(e){let t=IDBKeyRange.upperBound([this.userId,Number.POSITIVE_INFINITY]),r=Tn;return Lt(e).Z({index:wn,range:t,reverse:!0},(i,s,a)=>{r=s.batchId,a.done()}).next(()=>r)}getAllMutationBatches(e){let t=IDBKeyRange.bound([this.userId,Tn],[this.userId,Number.POSITIVE_INFINITY]);return Lt(e).G(wn,t).next(r=>r.map(i=>gn(this.serializer,i)))}getAllMutationBatchesAffectingDocumentKey(e,t){let r=co(this.userId,t.path),i=IDBKeyRange.lowerBound(r),s=[];return Xn(e).Z({range:i},(a,c,u)=>{let[d,f,g]=a,b=ot(f);if(d===this.userId&&t.path.isEqual(b))return Lt(e).get(g).next(R=>{if(!R)throw F();U(R.userId===this.userId),s.push(gn(this.serializer,R))});u.done()}).next(()=>s)}getAllMutationBatchesAffectingDocumentKeys(e,t){let r=new Z($),i=[];return t.forEach(s=>{let a=co(this.userId,s.path),c=IDBKeyRange.lowerBound(a),u=Xn(e).Z({range:c},(d,f,g)=>{let[b,R,k]=d,O=ot(R);b===this.userId&&s.path.isEqual(O)?r=r.add(k):g.done()});i.push(u)}),A.waitFor(i).next(()=>this.kn(e,r))}getAllMutationBatchesAffectingQuery(e,t){let r=t.path,i=r.length+1,s=co(this.userId,r),a=IDBKeyRange.lowerBound(s),c=new Z($);return Xn(e).Z({range:a},(u,d,f)=>{let[g,b,R]=u,k=ot(b);g===this.userId&&r.isPrefixOf(k)?k.length===i&&(c=c.add(R)):f.done()}).next(()=>this.kn(e,c))}kn(e,t){let r=[],i=[];return t.forEach(s=>{i.push(Lt(e).get(s).next(a=>{if(a===null)throw F();U(a.userId===this.userId),r.push(gn(this.serializer,a))}))}),A.waitFor(i).next(()=>r)}removeMutationBatch(e,t){return yg(e.ue,this.userId,t).next(r=>(e.addOnCommittedListener(()=>{this.qn(t.batchId)}),A.forEach(r,i=>this.referenceDelegate.markPotentiallyOrphaned(e,i))))}qn(e){delete this.Bn[e]}performConsistencyCheck(e){return this.checkEmpty(e).next(t=>{if(!t)return A.resolve();let r=IDBKeyRange.lowerBound(function(a){return[a]}(this.userId)),i=[];return Xn(e).Z({range:r},(s,a,c)=>{if(s[0]===this.userId){let u=ot(s[1]);i.push(u)}else c.done()}).next(()=>{U(i.length===0)})})}containsKey(e,t){return wg(e,this.userId,t)}Qn(e){return vg(e).get(this.userId).next(t=>t||{userId:this.userId,lastAcknowledgedBatchId:Tn,lastStreamToken:""})}};function wg(n,e,t){let r=co(e,t.path),i=r[1],s=IDBKeyRange.lowerBound(r),a=!1;return Xn(n).Z({range:s,Y:!0},(c,u,d)=>{let[f,g,b]=c;f===e&&g===i&&(a=!0),d.done()}).next(()=>a)}function Lt(n){return fe(n,Qe)}function Xn(n){return fe(n,ir)}function vg(n){return fe(n,Ti)}var gr=class n{constructor(e){this.$n=e}next(){return this.$n+=2,this.$n}static Kn(){return new n(0)}static Un(){return new n(-1)}};var tl=class{constructor(e,t){this.referenceDelegate=e,this.serializer=t}allocateTargetId(e){return this.Wn(e).next(t=>{let r=new gr(t.highestTargetId);return t.highestTargetId=r.next(),this.Gn(e,t).next(()=>t.highestTargetId)})}getLastRemoteSnapshotVersion(e){return this.Wn(e).next(t=>Q.fromTimestamp(new ke(t.lastRemoteSnapshotVersion.seconds,t.lastRemoteSnapshotVersion.nanoseconds)))}getHighestSequenceNumber(e){return this.Wn(e).next(t=>t.highestListenSequenceNumber)}setTargetsMetadata(e,t,r){return this.Wn(e).next(i=>(i.highestListenSequenceNumber=t,r&&(i.lastRemoteSnapshotVersion=r.toTimestamp()),t>i.highestListenSequenceNumber&&(i.highestListenSequenceNumber=t),this.Gn(e,i)))}addTargetData(e,t){return this.zn(e,t).next(()=>this.Wn(e).next(r=>(r.targetCount+=1,this.jn(t,r),this.Gn(e,r))))}updateTargetData(e,t){return this.zn(e,t)}removeTargetData(e,t){return this.removeMatchingKeysForTargetId(e,t.targetId).next(()=>Wn(e).delete(t.targetId)).next(()=>this.Wn(e)).next(r=>(U(r.targetCount>0),r.targetCount-=1,this.Gn(e,r)))}removeTargets(e,t,r){let i=0,s=[];return Wn(e).Z((a,c)=>{let u=pi(c);u.sequenceNumber<=t&&r.get(u.targetId)===null&&(i++,s.push(this.removeTargetData(e,u)))}).next(()=>A.waitFor(s)).next(()=>i)}forEachTarget(e,t){return Wn(e).Z((r,i)=>{let s=pi(i);t(s)})}Wn(e){return om(e).get(Eo).next(t=>(U(t!==null),t))}Gn(e,t){return om(e).put(Eo,t)}zn(e,t){return Wn(e).put(fg(this.serializer,t))}jn(e,t){let r=!1;return e.targetId>t.highestTargetId&&(t.highestTargetId=e.targetId,r=!0),e.sequenceNumber>t.highestListenSequenceNumber&&(t.highestListenSequenceNumber=e.sequenceNumber,r=!0),r}getTargetCount(e){return this.Wn(e).next(t=>t.targetCount)}getTargetData(e,t){let r=An(t),i=IDBKeyRange.bound([r,Number.NEGATIVE_INFINITY],[r,Number.POSITIVE_INFINITY]),s=null;return Wn(e).Z({range:i,index:Pm},(a,c,u)=>{let d=pi(c);Fi(t,d.target)&&(s=d,u.done())}).next(()=>s)}addMatchingKeys(e,t,r){let i=[],s=Ft(e);return t.forEach(a=>{let c=Ce(a.path);i.push(s.put({targetId:r,path:c})),i.push(this.referenceDelegate.addReference(e,r,a))}),A.waitFor(i)}removeMatchingKeys(e,t,r){let i=Ft(e);return A.forEach(t,s=>{let a=Ce(s.path);return A.waitFor([i.delete([r,a]),this.referenceDelegate.removeReference(e,r,s)])})}removeMatchingKeysForTargetId(e,t){let r=Ft(e),i=IDBKeyRange.bound([t],[t+1],!1,!0);return r.delete(i)}getMatchingKeysForTargetId(e,t){let r=IDBKeyRange.bound([t],[t+1],!1,!0),i=Ft(e),s=we();return i.Z({range:r,Y:!0},(a,c,u)=>{let d=ot(a[1]),f=new V(d);s=s.add(f)}).next(()=>s)}containsKey(e,t){let r=Ce(t.path),i=IDBKeyRange.bound([r],[Tm(r)],!1,!0),s=0;return Ft(e).Z({index:$l,Y:!0,range:i},([a,c],u,d)=>{a!==0&&(s++,d.done())}).next(()=>s>0)}lt(e,t){return Wn(e).get(t).next(r=>r?pi(r):null)}};function Wn(n){return fe(n,sr)}function om(n){return fe(n,En)}function Ft(n){return fe(n,or)}var am="LruGarbageCollector",Ig=1048576;function cm([n,e],[t,r]){let i=$(n,t);return i===0?$(e,r):i}var nl=class{constructor(e){this.Hn=e,this.buffer=new Z(cm),this.Jn=0}Yn(){return++this.Jn}Zn(e){let t=[e,this.Yn()];if(this.buffer.size<this.Hn)this.buffer=this.buffer.add(t);else{let r=this.buffer.last();cm(t,r)<0&&(this.buffer=this.buffer.delete(r).add(t))}}get maxValue(){return this.buffer.last()[0]}},rl=class{constructor(e,t,r){this.garbageCollector=e,this.asyncQueue=t,this.localStore=r,this.Xn=null}start(){this.garbageCollector.params.cacheSizeCollectionThreshold!==-1&&this.er(6e4)}stop(){this.Xn&&(this.Xn.cancel(),this.Xn=null)}get started(){return this.Xn!==null}er(e){D(am,`Garbage collection scheduled in ${e}ms`),this.Xn=this.asyncQueue.enqueueAfterDelay("lru_garbage_collection",e,async()=>{this.Xn=null;try{await this.localStore.collectGarbage(this.garbageCollector)}catch(t){yr(t)?D(am,"Ignoring IndexedDB error during garbage collection: ",t):await ea(t)}await this.er(3e5)})}},il=class{constructor(e,t){this.tr=e,this.params=t}calculateTargetCount(e,t){return this.tr.nr(e).next(r=>Math.floor(t/100*r))}nthSequenceNumber(e,t){if(t===0)return A.resolve(Me.ae);let r=new nl(t);return this.tr.forEachTarget(e,i=>r.Zn(i.sequenceNumber)).next(()=>this.tr.rr(e,i=>r.Zn(i))).next(()=>r.maxValue)}removeTargets(e,t,r){return this.tr.removeTargets(e,t,r)}removeOrphanedDocuments(e,t){return this.tr.removeOrphanedDocuments(e,t)}collect(e,t){return this.params.cacheSizeCollectionThreshold===-1?(D("LruGarbageCollector","Garbage collection skipped; disabled"),A.resolve(sm)):this.getCacheSize(e).next(r=>r<this.params.cacheSizeCollectionThreshold?(D("LruGarbageCollector",`Garbage collection skipped; Cache size ${r} is lower than threshold ${this.params.cacheSizeCollectionThreshold}`),sm):this.ir(e,t))}getCacheSize(e){return this.tr.getCacheSize(e)}ir(e,t){let r,i,s,a,c,u,d,f=Date.now();return this.calculateTargetCount(e,this.params.percentileToCollect).next(g=>(g>this.params.maximumSequenceNumbersToCollect?(D("LruGarbageCollector",`Capping sequence numbers to collect down to the maximum of ${this.params.maximumSequenceNumbersToCollect} from ${g}`),i=this.params.maximumSequenceNumbersToCollect):i=g,a=Date.now(),this.nthSequenceNumber(e,i))).next(g=>(r=g,c=Date.now(),this.removeTargets(e,r,t))).next(g=>(s=g,u=Date.now(),this.removeOrphanedDocuments(e,r))).next(g=>(d=Date.now(),Qn()<=j.DEBUG&&D("LruGarbageCollector",`LRU Garbage Collection
	Counted targets in ${a-f}ms
	Determined least recently used ${i} in `+(c-a)+`ms
	Removed ${s} targets in `+(u-c)+`ms
	Removed ${g} documents in `+(d-u)+`ms
Total Duration: ${d-f}ms`),A.resolve({didRun:!0,sequenceNumbersCollected:i,targetsRemoved:s,documentsRemoved:g})))}};function ib(n,e){return new il(n,e)}var sl=class{constructor(e,t){this.db=e,this.garbageCollector=ib(this,t)}nr(e){let t=this.sr(e);return this.db.getTargetCache().getTargetCount(e).next(r=>t.next(i=>r+i))}sr(e){let t=0;return this.rr(e,r=>{t++}).next(()=>t)}forEachTarget(e,t){return this.db.getTargetCache().forEachTarget(e,t)}rr(e,t){return this._r(e,(r,i)=>t(i))}addReference(e,t,r){return so(e,r)}removeReference(e,t,r){return so(e,r)}removeTargets(e,t,r){return this.db.getTargetCache().removeTargets(e,t,r)}markPotentiallyOrphaned(e,t){return so(e,t)}ar(e,t){return function(i,s){let a=!1;return vg(i).X(c=>wg(i,c,s).next(u=>(u&&(a=!0),A.resolve(!u)))).next(()=>a)}(e,t)}removeOrphanedDocuments(e,t){let r=this.db.getRemoteDocumentCache().newChangeBuffer(),i=[],s=0;return this._r(e,(a,c)=>{if(c<=t){let u=this.ar(e,a).next(d=>{if(!d)return s++,r.getEntry(e,a).next(()=>(r.removeEntry(a,Q.min()),Ft(e).delete(function(g){return[0,Ce(g.path)]}(a))))});i.push(u)}}).next(()=>A.waitFor(i)).next(()=>r.apply(e)).next(()=>s)}removeTarget(e,t){let r=t.withSequenceNumber(e.currentSequenceNumber);return this.db.getTargetCache().updateTargetData(e,r)}updateLimboDocument(e,t){return so(e,t)}_r(e,t){let r=Ft(e),i,s=Me.ae;return r.Z({index:$l},([a,c],{path:u,sequenceNumber:d})=>{a===0?(s!==Me.ae&&t(new V(ot(i)),s),s=d,i=u):s=Me.ae}).next(()=>{s!==Me.ae&&t(new V(ot(i)),s)})}getCacheSize(e){return this.db.getRemoteDocumentCache().getSize(e)}};function so(n,e){return Ft(n).put(function(r,i){return{targetId:0,path:Ce(r.path),sequenceNumber:i}}(e,n.currentSequenceNumber))}var jo=class{constructor(){this.changes=new lt(e=>e.toString(),(e,t)=>e.isEqual(t)),this.changesApplied=!1}addEntry(e){this.assertNotApplied(),this.changes.set(e.key,e)}removeEntry(e,t){this.assertNotApplied(),this.changes.set(e,ze.newInvalidDocument(e).setReadTime(t))}getEntry(e,t){this.assertNotApplied();let r=this.changes.get(t);return r!==void 0?A.resolve(r):this.getFromCache(e,t)}getEntries(e,t){return this.getAllFromCache(e,t)}apply(e){return this.assertNotApplied(),this.changesApplied=!0,this.applyChanges(e)}assertNotApplied(){}};var ol=class{constructor(e){this.serializer=e}setIndexManager(e){this.indexManager=e}addEntry(e,t,r){return dn(e).put(r)}removeEntry(e,t,r){return dn(e).delete(function(s,a){let c=s.path.toArray();return[c.slice(0,c.length-2),c[c.length-2],Lo(a),c[c.length-1]]}(t,r))}updateMetadata(e,t){return this.getMetadata(e).next(r=>(r.byteSize+=t,this.ur(e,r)))}getEntry(e,t){let r=ze.newInvalidDocument(t);return dn(e).Z({index:uo,range:IDBKeyRange.only(di(t))},(i,s)=>{r=this.cr(t,s)}).next(()=>r)}lr(e,t){let r={size:0,document:ze.newInvalidDocument(t)};return dn(e).Z({index:uo,range:IDBKeyRange.only(di(t))},(i,s)=>{r={document:this.cr(t,s),size:Bo(s)}}).next(()=>r)}getEntries(e,t){let r=vn();return this.hr(e,t,(i,s)=>{let a=this.cr(i,s);r=r.insert(i,a)}).next(()=>r)}Pr(e,t){let r=vn(),i=new Fe(V.comparator);return this.hr(e,t,(s,a)=>{let c=this.cr(s,a);r=r.insert(s,c),i=i.insert(s,Bo(a))}).next(()=>({documents:r,Tr:i}))}hr(e,t,r){if(t.isEmpty())return A.resolve();let i=new Z(hm);t.forEach(u=>i=i.add(u));let s=IDBKeyRange.bound(di(i.first()),di(i.last())),a=i.getIterator(),c=a.getNext();return dn(e).Z({index:uo,range:s},(u,d,f)=>{let g=V.fromSegments([...d.prefixPath,d.collectionGroup,d.documentId]);for(;c&&hm(c,g)<0;)r(c,null),c=a.getNext();c&&c.isEqual(g)&&(r(c,d),c=a.hasNext()?a.getNext():null),c?f.W(di(c)):f.done()}).next(()=>{for(;c;)r(c,null),c=a.hasNext()?a.getNext():null})}getDocumentsMatchingQuery(e,t,r,i,s){let a=t.path,c=[a.popLast().toArray(),a.lastSegment(),Lo(r.readTime),r.documentKey.path.isEmpty()?"":r.documentKey.path.lastSegment()],u=[a.popLast().toArray(),a.lastSegment(),[Number.MAX_SAFE_INTEGER,Number.MAX_SAFE_INTEGER],""];return dn(e).G(IDBKeyRange.bound(c,u,!0)).next(d=>{s?.incrementDocumentReadCount(d.length);let f=vn();for(let g of d){let b=this.cr(V.fromSegments(g.prefixPath.concat(g.collectionGroup,g.documentId)),g);b.isFoundDocument()&&(oa(t,b)||i.has(b.key))&&(f=f.insert(b.key,b))}return f})}getAllFromCollectionGroup(e,t,r,i){let s=vn(),a=lm(t,r),c=lm(t,$e.max());return dn(e).Z({index:Rm,range:IDBKeyRange.bound(a,c,!0)},(u,d,f)=>{let g=this.cr(V.fromSegments(d.prefixPath.concat(d.collectionGroup,d.documentId)),d);s=s.insert(g.key,g),s.size===i&&f.done()}).next(()=>s)}newChangeBuffer(e){return new al(this,!!e&&e.trackRemovals)}getSize(e){return this.getMetadata(e).next(t=>t.byteSize)}getMetadata(e){return um(e).get(vu).next(t=>(U(!!t),t))}ur(e,t){return um(e).put(vu,t)}cr(e,t){if(t){let r=tb(this.serializer,t);if(!(r.isNoDocument()&&r.version.isEqual(Q.min())))return r}return ze.newInvalidDocument(e)}};function Tg(n){return new ol(n)}var al=class extends jo{constructor(e,t){super(),this.Ir=e,this.trackRemovals=t,this.Er=new lt(r=>r.toString(),(r,i)=>r.isEqual(i))}applyChanges(e){let t=[],r=0,i=new Z((s,a)=>$(s.canonicalString(),a.canonicalString()));return this.changes.forEach((s,a)=>{let c=this.Er.get(s);if(t.push(this.Ir.removeEntry(e,s,c.readTime)),a.isValidDocument()){let u=Wp(this.Ir.serializer,a);i=i.add(s.path.popLast());let d=Bo(u);r+=d-c.size,t.push(this.Ir.addEntry(e,s,u))}else if(r-=c.size,this.trackRemovals){let u=Wp(this.Ir.serializer,a.convertToNoDocument(Q.min()));t.push(this.Ir.addEntry(e,s,u))}}),i.forEach(s=>{t.push(this.Ir.indexManager.addToCollectionParentIndex(e,s))}),t.push(this.Ir.updateMetadata(e,r)),A.waitFor(t)}getFromCache(e,t){return this.Ir.lr(e,t).next(r=>(this.Er.set(t,{size:r.size,readTime:r.document.readTime}),r.document))}getAllFromCache(e,t){return this.Ir.Pr(e,t).next(({documents:r,Tr:i})=>(i.forEach((s,a)=>{this.Er.set(s,{size:a,readTime:r.get(s).readTime})}),r))}};function um(n){return fe(n,Ei)}function dn(n){return fe(n,To)}function di(n){let e=n.path.toArray();return[e.slice(0,e.length-2),e[e.length-2],e[e.length-1]]}function lm(n,e){let t=e.documentKey.path.toArray();return[n,Lo(e.readTime),t.slice(0,t.length-2),t.length>0?t[t.length-1]:""]}function hm(n,e){let t=n.path.toArray(),r=e.path.toArray(),i=0;for(let s=0;s<t.length-2&&s<r.length-2;++s)if(i=$(t[s],r[s]),i)return i;return i=$(t.length,r.length),i||(i=$(t[t.length-2],r[r.length-2]),i||$(t[t.length-1],r[r.length-1]))}var cl=class{constructor(e,t){this.overlayedDocument=e,this.mutatedFields=t}};var zo=class{constructor(e,t,r,i){this.remoteDocumentCache=e,this.mutationQueue=t,this.documentOverlayCache=r,this.indexManager=i}getDocument(e,t){let r=null;return this.documentOverlayCache.getOverlay(e,t).next(i=>(r=i,this.remoteDocumentCache.getEntry(e,t))).next(i=>(r!==null&&wi(r.mutation,i,Ut.empty(),ke.now()),i))}getDocuments(e,t){return this.remoteDocumentCache.getEntries(e,t).next(r=>this.getLocalViewOfDocuments(e,r,we()).next(()=>r))}getLocalViewOfDocuments(e,t,r=we()){let i=at();return this.populateOverlays(e,i,t).next(()=>this.computeViews(e,t,i,r).next(s=>{let a=ro();return s.forEach((c,u)=>{a=a.insert(c,u.overlayedDocument)}),a}))}getOverlayedDocuments(e,t){let r=at();return this.populateOverlays(e,r,t).next(()=>this.computeViews(e,t,r,we()))}populateOverlays(e,t,r){let i=[];return r.forEach(s=>{t.has(s)||i.push(s)}),this.documentOverlayCache.getOverlays(e,i).next(s=>{s.forEach((a,c)=>{t.set(a,c)})})}computeViews(e,t,r,i){let s=vn(),a=yi(),c=function(){return yi()}();return t.forEach((u,d)=>{let f=r.get(d.key);i.has(d.key)&&(f===void 0||f.mutation instanceof Ht)?s=s.insert(d.key,d):f!==void 0?(a.set(d.key,f.mutation.getFieldMask()),wi(f.mutation,d,f.mutation.getFieldMask(),ke.now())):a.set(d.key,Ut.empty())}),this.recalculateAndSaveOverlays(e,s).next(u=>(u.forEach((d,f)=>a.set(d,f)),t.forEach((d,f)=>{var g;return c.set(d,new cl(f,(g=a.get(d))!==null&&g!==void 0?g:null))}),c))}recalculateAndSaveOverlays(e,t){let r=yi(),i=new Fe((a,c)=>a-c),s=we();return this.mutationQueue.getAllMutationBatchesAffectingDocumentKeys(e,t).next(a=>{for(let c of a)c.keys().forEach(u=>{let d=t.get(u);if(d===null)return;let f=r.get(u)||Ut.empty();f=c.applyToLocalView(d,f),r.set(u,f);let g=(i.get(c.batchId)||we()).add(u);i=i.insert(c.batchId,g)})}).next(()=>{let a=[],c=i.getReverseIterator();for(;c.hasNext();){let u=c.getNext(),d=u.key,f=u.value,g=Zm();f.forEach(b=>{if(!s.has(b)){let R=rg(t.get(b),r.get(b));R!==null&&g.set(b,R),s=s.add(b)}}),a.push(this.documentOverlayCache.saveOverlays(e,d,g))}return A.waitFor(a)}).next(()=>r)}recalculateAndSaveOverlaysForDocumentKeys(e,t){return this.remoteDocumentCache.getEntries(e,t).next(r=>this.recalculateAndSaveOverlays(e,r))}getDocumentsMatchingQuery(e,t,r,i){return function(a){return V.isDocumentKey(a.path)&&a.collectionGroup===null&&a.filters.length===0}(t)?this.getDocumentsMatchingDocumentQuery(e,t.path):IE(t)?this.getDocumentsMatchingCollectionGroupQuery(e,t,r,i):this.getDocumentsMatchingCollectionQuery(e,t,r,i)}getNextDocuments(e,t,r,i){return this.remoteDocumentCache.getAllFromCollectionGroup(e,t,r,i).next(s=>{let a=i-s.size>0?this.documentOverlayCache.getOverlaysForCollectionGroup(e,t,r.largestBatchId,i-s.size):A.resolve(at()),c=vi,u=s;return a.next(d=>A.forEach(d,(f,g)=>(c<g.largestBatchId&&(c=g.largestBatchId),s.get(f)?A.resolve():this.remoteDocumentCache.getEntry(e,f).next(b=>{u=u.insert(f,b)}))).next(()=>this.populateOverlays(e,d,s)).next(()=>this.computeViews(e,u,d,we())).next(f=>({batchId:c,changes:SE(f)})))})}getDocumentsMatchingDocumentQuery(e,t){return this.getDocument(e,new V(t)).next(r=>{let i=ro();return r.isFoundDocument()&&(i=i.insert(r.key,r)),i})}getDocumentsMatchingCollectionGroupQuery(e,t,r,i){let s=t.collectionGroup,a=ro();return this.indexManager.getCollectionParents(e,s).next(c=>A.forEach(c,u=>{let d=function(g,b){return new fr(b,null,g.explicitOrderBy.slice(),g.filters.slice(),g.limit,g.limitType,g.startAt,g.endAt)}(t,u.child(s));return this.getDocumentsMatchingCollectionQuery(e,d,r,i).next(f=>{f.forEach((g,b)=>{a=a.insert(g,b)})})}).next(()=>a))}getDocumentsMatchingCollectionQuery(e,t,r,i){let s;return this.documentOverlayCache.getOverlaysForCollection(e,t.path,r.largestBatchId).next(a=>(s=a,this.remoteDocumentCache.getDocumentsMatchingQuery(e,t,r,s,i))).next(a=>{s.forEach((u,d)=>{let f=d.getKey();a.get(f)===null&&(a=a.insert(f,ze.newInvalidDocument(f)))});let c=ro();return a.forEach((u,d)=>{let f=s.get(u);f!==void 0&&wi(f.mutation,d,Ut.empty(),ke.now()),oa(t,d)&&(c=c.insert(u,d))}),c})}};var ul=class{constructor(e){this.serializer=e,this.dr=new Map,this.Ar=new Map}getBundleMetadata(e,t){return A.resolve(this.dr.get(t))}saveBundleMetadata(e,t){return this.dr.set(t.id,function(i){return{id:i.id,version:i.version,createTime:Ye(i.createTime)}}(t)),A.resolve()}getNamedQuery(e,t){return A.resolve(this.Ar.get(t))}saveNamedQuery(e,t){return this.Ar.set(t.name,function(i){return{name:i.name,query:pg(i.bundledQuery),readTime:Ye(i.readTime)}}(t)),A.resolve()}};var ll=class{constructor(){this.overlays=new Fe(V.comparator),this.Rr=new Map}getOverlay(e,t){return A.resolve(this.overlays.get(t))}getOverlays(e,t){let r=at();return A.forEach(t,i=>this.getOverlay(e,i).next(s=>{s!==null&&r.set(i,s)})).next(()=>r)}saveOverlays(e,t,r){return r.forEach((i,s)=>{this.Et(e,t,s)}),A.resolve()}removeOverlaysForBatchId(e,t,r){let i=this.Rr.get(r);return i!==void 0&&(i.forEach(s=>this.overlays=this.overlays.remove(s)),this.Rr.delete(r)),A.resolve()}getOverlaysForCollection(e,t,r){let i=at(),s=t.length+1,a=new V(t.child("")),c=this.overlays.getIteratorFrom(a);for(;c.hasNext();){let u=c.getNext().value,d=u.getKey();if(!t.isPrefixOf(d.path))break;d.path.length===s&&u.largestBatchId>r&&i.set(u.getKey(),u)}return A.resolve(i)}getOverlaysForCollectionGroup(e,t,r,i){let s=new Fe((d,f)=>d-f),a=this.overlays.getIterator();for(;a.hasNext();){let d=a.getNext().value;if(d.getKey().getCollectionGroup()===t&&d.largestBatchId>r){let f=s.get(d.largestBatchId);f===null&&(f=at(),s=s.insert(d.largestBatchId,f)),f.set(d.getKey(),d)}}let c=at(),u=s.getIterator();for(;u.hasNext()&&(u.getNext().value.forEach((d,f)=>c.set(d,f)),!(c.size()>=i)););return A.resolve(c)}Et(e,t,r){let i=this.overlays.get(r.key);if(i!==null){let a=this.Rr.get(i.largestBatchId).delete(r.key);this.Rr.set(i.largestBatchId,a)}this.overlays=this.overlays.insert(r.key,new Ni(t,r));let s=this.Rr.get(t);s===void 0&&(s=we(),this.Rr.set(t,s)),this.Rr.set(t,s.add(r.key))}};var hl=class{constructor(){this.sessionToken=Je.EMPTY_BYTE_STRING}getSessionToken(e){return A.resolve(this.sessionToken)}setSessionToken(e,t){return this.sessionToken=t,A.resolve()}};var xi=class{constructor(){this.Vr=new Z(ue.mr),this.gr=new Z(ue.pr)}isEmpty(){return this.Vr.isEmpty()}addReference(e,t){let r=new ue(e,t);this.Vr=this.Vr.add(r),this.gr=this.gr.add(r)}yr(e,t){e.forEach(r=>this.addReference(r,t))}removeReference(e,t){this.wr(new ue(e,t))}Sr(e,t){e.forEach(r=>this.removeReference(r,t))}br(e){let t=new V(new ae([])),r=new ue(t,e),i=new ue(t,e+1),s=[];return this.gr.forEachInRange([r,i],a=>{this.wr(a),s.push(a.key)}),s}Dr(){this.Vr.forEach(e=>this.wr(e))}wr(e){this.Vr=this.Vr.delete(e),this.gr=this.gr.delete(e)}vr(e){let t=new V(new ae([])),r=new ue(t,e),i=new ue(t,e+1),s=we();return this.gr.forEachInRange([r,i],a=>{s=s.add(a.key)}),s}containsKey(e){let t=new ue(e,0),r=this.Vr.firstAfterOrEqual(t);return r!==null&&e.isEqual(r.key)}},ue=class{constructor(e,t){this.key=e,this.Cr=t}static mr(e,t){return V.comparator(e.key,t.key)||$(e.Cr,t.Cr)}static pr(e,t){return $(e.Cr,t.Cr)||V.comparator(e.key,t.key)}};var dl=class{constructor(e,t){this.indexManager=e,this.referenceDelegate=t,this.mutationQueue=[],this.Fr=1,this.Mr=new Z(ue.mr)}checkEmpty(e){return A.resolve(this.mutationQueue.length===0)}addMutationBatch(e,t,r,i){let s=this.Fr;this.Fr++,this.mutationQueue.length>0&&this.mutationQueue[this.mutationQueue.length-1];let a=new Di(s,t,r,i);this.mutationQueue.push(a);for(let c of i)this.Mr=this.Mr.add(new ue(c.key,s)),this.indexManager.addToCollectionParentIndex(e,c.key.path.popLast());return A.resolve(a)}lookupMutationBatch(e,t){return A.resolve(this.Or(t))}getNextMutationBatchAfterBatchId(e,t){let r=t+1,i=this.Nr(r),s=i<0?0:i;return A.resolve(this.mutationQueue.length>s?this.mutationQueue[s]:null)}getHighestUnacknowledgedBatchId(){return A.resolve(this.mutationQueue.length===0?Tn:this.Fr-1)}getAllMutationBatches(e){return A.resolve(this.mutationQueue.slice())}getAllMutationBatchesAffectingDocumentKey(e,t){let r=new ue(t,0),i=new ue(t,Number.POSITIVE_INFINITY),s=[];return this.Mr.forEachInRange([r,i],a=>{let c=this.Or(a.Cr);s.push(c)}),A.resolve(s)}getAllMutationBatchesAffectingDocumentKeys(e,t){let r=new Z($);return t.forEach(i=>{let s=new ue(i,0),a=new ue(i,Number.POSITIVE_INFINITY);this.Mr.forEachInRange([s,a],c=>{r=r.add(c.Cr)})}),A.resolve(this.Br(r))}getAllMutationBatchesAffectingQuery(e,t){let r=t.path,i=r.length+1,s=r;V.isDocumentKey(s)||(s=s.child(""));let a=new ue(new V(s),0),c=new Z($);return this.Mr.forEachWhile(u=>{let d=u.key.path;return!!r.isPrefixOf(d)&&(d.length===i&&(c=c.add(u.Cr)),!0)},a),A.resolve(this.Br(c))}Br(e){let t=[];return e.forEach(r=>{let i=this.Or(r);i!==null&&t.push(i)}),t}removeMutationBatch(e,t){U(this.Lr(t.batchId,"removed")===0),this.mutationQueue.shift();let r=this.Mr;return A.forEach(t.mutations,i=>{let s=new ue(i.key,t.batchId);return r=r.delete(s),this.referenceDelegate.markPotentiallyOrphaned(e,i.key)}).next(()=>{this.Mr=r})}qn(e){}containsKey(e,t){let r=new ue(t,0),i=this.Mr.firstAfterOrEqual(r);return A.resolve(t.isEqual(i&&i.key))}performConsistencyCheck(e){return this.mutationQueue.length,A.resolve()}Lr(e,t){return this.Nr(e)}Nr(e){return this.mutationQueue.length===0?0:e-this.mutationQueue[0].batchId}Or(e){let t=this.Nr(e);return t<0||t>=this.mutationQueue.length?null:this.mutationQueue[t]}};var fl=class{constructor(e){this.kr=e,this.docs=function(){return new Fe(V.comparator)}(),this.size=0}setIndexManager(e){this.indexManager=e}addEntry(e,t){let r=t.key,i=this.docs.get(r),s=i?i.size:0,a=this.kr(t);return this.docs=this.docs.insert(r,{document:t.mutableCopy(),size:a}),this.size+=a-s,this.indexManager.addToCollectionParentIndex(e,r.path.popLast())}removeEntry(e){let t=this.docs.get(e);t&&(this.docs=this.docs.remove(e),this.size-=t.size)}getEntry(e,t){let r=this.docs.get(t);return A.resolve(r?r.document.mutableCopy():ze.newInvalidDocument(t))}getEntries(e,t){let r=vn();return t.forEach(i=>{let s=this.docs.get(i);r=r.insert(i,s?s.document.mutableCopy():ze.newInvalidDocument(i))}),A.resolve(r)}getDocumentsMatchingQuery(e,t,r,i){let s=vn(),a=t.path,c=new V(a.child("__id-9223372036854775808__")),u=this.docs.getIteratorFrom(c);for(;u.hasNext();){let{key:d,value:{document:f}}=u.getNext();if(!a.isPrefixOf(d.path))break;d.path.length>a.length+1||jl(Em(f),r)<=0||(i.has(f.key)||oa(t,f))&&(s=s.insert(f.key,f.mutableCopy()))}return A.resolve(s)}getAllFromCollectionGroup(e,t,r,i){F()}qr(e,t){return A.forEach(this.docs,r=>t(r))}newChangeBuffer(e){return new pl(this)}getSize(e){return A.resolve(this.size)}},pl=class extends jo{constructor(e){super(),this.Ir=e}applyChanges(e){let t=[];return this.changes.forEach((r,i)=>{i.isValidDocument()?t.push(this.Ir.addEntry(e,i)):this.Ir.removeEntry(r)}),A.waitFor(t)}getFromCache(e,t){return this.Ir.getEntry(e,t)}getAllFromCache(e,t){return this.Ir.getEntries(e,t)}};var ml=class{constructor(e){this.persistence=e,this.Qr=new lt(t=>An(t),Fi),this.lastRemoteSnapshotVersion=Q.min(),this.highestTargetId=0,this.$r=0,this.Kr=new xi,this.targetCount=0,this.Ur=gr.Kn()}forEachTarget(e,t){return this.Qr.forEach((r,i)=>t(i)),A.resolve()}getLastRemoteSnapshotVersion(e){return A.resolve(this.lastRemoteSnapshotVersion)}getHighestSequenceNumber(e){return A.resolve(this.$r)}allocateTargetId(e){return this.highestTargetId=this.Ur.next(),A.resolve(this.highestTargetId)}setTargetsMetadata(e,t,r){return r&&(this.lastRemoteSnapshotVersion=r),t>this.$r&&(this.$r=t),A.resolve()}zn(e){this.Qr.set(e.target,e);let t=e.targetId;t>this.highestTargetId&&(this.Ur=new gr(t),this.highestTargetId=t),e.sequenceNumber>this.$r&&(this.$r=e.sequenceNumber)}addTargetData(e,t){return this.zn(t),this.targetCount+=1,A.resolve()}updateTargetData(e,t){return this.zn(t),A.resolve()}removeTargetData(e,t){return this.Qr.delete(t.target),this.Kr.br(t.targetId),this.targetCount-=1,A.resolve()}removeTargets(e,t,r){let i=0,s=[];return this.Qr.forEach((a,c)=>{c.sequenceNumber<=t&&r.get(c.targetId)===null&&(this.Qr.delete(a),s.push(this.removeMatchingKeysForTargetId(e,c.targetId)),i++)}),A.waitFor(s).next(()=>i)}getTargetCount(e){return A.resolve(this.targetCount)}getTargetData(e,t){let r=this.Qr.get(t)||null;return A.resolve(r)}addMatchingKeys(e,t,r){return this.Kr.yr(t,r),A.resolve()}removeMatchingKeys(e,t,r){this.Kr.Sr(t,r);let i=this.persistence.referenceDelegate,s=[];return i&&t.forEach(a=>{s.push(i.markPotentiallyOrphaned(e,a))}),A.waitFor(s)}removeMatchingKeysForTargetId(e,t){return this.Kr.br(t),A.resolve()}getMatchingKeysForTargetId(e,t){let r=this.Kr.vr(t);return A.resolve(r)}containsKey(e,t){return A.resolve(this.Kr.containsKey(t))}};var $o=class{constructor(e,t){this.Wr={},this.overlays={},this.Gr=new Me(0),this.zr=!1,this.zr=!0,this.jr=new hl,this.referenceDelegate=e(this),this.Hr=new ml(this),this.indexManager=new Zu,this.remoteDocumentCache=function(i){return new fl(i)}(r=>this.referenceDelegate.Jr(r)),this.serializer=new Vo(t),this.Yr=new ul(this.serializer)}start(){return Promise.resolve()}shutdown(){return this.zr=!1,Promise.resolve()}get started(){return this.zr}setDatabaseDeletedListener(){}setNetworkEnabled(){}getIndexManager(e){return this.indexManager}getDocumentOverlayCache(e){let t=this.overlays[e.toKey()];return t||(t=new ll,this.overlays[e.toKey()]=t),t}getMutationQueue(e,t){let r=this.Wr[e.toKey()];return r||(r=new dl(t,this.referenceDelegate),this.Wr[e.toKey()]=r),r}getGlobalsCache(){return this.jr}getTargetCache(){return this.Hr}getRemoteDocumentCache(){return this.remoteDocumentCache}getBundleCache(){return this.Yr}runTransaction(e,t,r){D("MemoryPersistence","Starting transaction:",e);let i=new gl(this.Gr.next());return this.referenceDelegate.Zr(),r(i).next(s=>this.referenceDelegate.Xr(i).next(()=>s)).toPromise().then(s=>(i.raiseOnCommittedEvent(),s))}ei(e,t){return A.or(Object.values(this.Wr).map(r=>()=>r.containsKey(e,t)))}},gl=class extends yo{constructor(e){super(),this.currentSequenceNumber=e}},Ko=class n{constructor(e){this.persistence=e,this.ti=new xi,this.ni=null}static ri(e){return new n(e)}get ii(){if(this.ni)return this.ni;throw F()}addReference(e,t,r){return this.ti.addReference(r,t),this.ii.delete(r.toString()),A.resolve()}removeReference(e,t,r){return this.ti.removeReference(r,t),this.ii.add(r.toString()),A.resolve()}markPotentiallyOrphaned(e,t){return this.ii.add(t.toString()),A.resolve()}removeTarget(e,t){this.ti.br(t.targetId).forEach(i=>this.ii.add(i.toString()));let r=this.persistence.getTargetCache();return r.getMatchingKeysForTargetId(e,t.targetId).next(i=>{i.forEach(s=>this.ii.add(s.toString()))}).next(()=>r.removeTargetData(e,t))}Zr(){this.ni=new Set}Xr(e){let t=this.persistence.getRemoteDocumentCache().newChangeBuffer();return A.forEach(this.ii,r=>{let i=V.fromPath(r);return this.si(e,i).next(s=>{s||t.removeEntry(i,Q.min())})}).next(()=>(this.ni=null,t.apply(e)))}updateLimboDocument(e,t){return this.si(e,t).next(r=>{r?this.ii.delete(t.toString()):this.ii.add(t.toString())})}Jr(e){return 0}si(e,t){return A.or([()=>A.resolve(this.ti.containsKey(t)),()=>this.persistence.getTargetCache().containsKey(e,t),()=>this.persistence.ei(e,t)])}};var _l=class{constructor(e){this.serializer=e}B(e,t,r,i){let s=new wo("createOrUpgrade",t);r<1&&i>=1&&(function(u){u.createObjectStore(Mi)}(e),function(u){u.createObjectStore(Ti,{keyPath:jT}),u.createObjectStore(Qe,{keyPath:kp,autoIncrement:!0}).createIndex(wn,Cp,{unique:!0}),u.createObjectStore(ir)}(e),dm(e),function(u){u.createObjectStore(pn)}(e));let a=A.resolve();return r<3&&i>=3&&(r!==0&&(function(u){u.deleteObjectStore(or),u.deleteObjectStore(sr),u.deleteObjectStore(En)}(e),dm(e)),a=a.next(()=>function(u){let d=u.store(En),f={highestTargetId:0,highestListenSequenceNumber:0,lastRemoteSnapshotVersion:Q.min().toTimestamp(),targetCount:0};return d.put(Eo,f)}(s))),r<4&&i>=4&&(r!==0&&(a=a.next(()=>function(u,d){return d.store(Qe).G().next(g=>{u.deleteObjectStore(Qe),u.createObjectStore(Qe,{keyPath:kp,autoIncrement:!0}).createIndex(wn,Cp,{unique:!0});let b=d.store(Qe),R=g.map(k=>b.put(k));return A.waitFor(R)})}(e,s))),a=a.next(()=>{(function(u){u.createObjectStore(ar,{keyPath:JT})})(e)})),r<5&&i>=5&&(a=a.next(()=>this._i(s))),r<6&&i>=6&&(a=a.next(()=>(function(u){u.createObjectStore(Ei)}(e),this.ai(s)))),r<7&&i>=7&&(a=a.next(()=>this.ui(s))),r<8&&i>=8&&(a=a.next(()=>this.ci(e,s))),r<9&&i>=9&&(a=a.next(()=>{(function(u){u.objectStoreNames.contains("remoteDocumentChanges")&&u.deleteObjectStore("remoteDocumentChanges")})(e)})),r<10&&i>=10&&(a=a.next(()=>this.li(s))),r<11&&i>=11&&(a=a.next(()=>{(function(u){u.createObjectStore(na,{keyPath:XT})})(e),function(u){u.createObjectStore(ra,{keyPath:ZT})}(e)})),r<12&&i>=12&&(a=a.next(()=>{(function(u){let d=u.createObjectStore(ia,{keyPath:oE});d.createIndex(Tu,aE,{unique:!1}),d.createIndex(Dm,cE,{unique:!1})})(e)})),r<13&&i>=13&&(a=a.next(()=>function(u){let d=u.createObjectStore(To,{keyPath:$T});d.createIndex(uo,KT),d.createIndex(Rm,GT)}(e)).next(()=>this.hi(e,s)).next(()=>e.deleteObjectStore(pn))),r<14&&i>=14&&(a=a.next(()=>this.Pi(e,s))),r<15&&i>=15&&(a=a.next(()=>function(u){u.createObjectStore(Kl,{keyPath:eE,autoIncrement:!0}).createIndex(Iu,tE,{unique:!1}),u.createObjectStore(bo,{keyPath:nE}).createIndex(km,rE,{unique:!1}),u.createObjectStore(Ao,{keyPath:iE}).createIndex(Cm,sE,{unique:!1})}(e))),r<16&&i>=16&&(a=a.next(()=>{t.objectStore(bo).clear()}).next(()=>{t.objectStore(Ao).clear()})),r<17&&i>=17&&(a=a.next(()=>{(function(u){u.createObjectStore(Gl,{keyPath:uE})})(e)})),a}ai(e){let t=0;return e.store(pn).Z((r,i)=>{t+=Bo(i)}).next(()=>{let r={byteSize:t};return e.store(Ei).put(vu,r)})}_i(e){let t=e.store(Ti),r=e.store(Qe);return t.G().next(i=>A.forEach(i,s=>{let a=IDBKeyRange.bound([s.userId,Tn],[s.userId,s.lastAcknowledgedBatchId]);return r.G(wn,a).next(c=>A.forEach(c,u=>{U(u.userId===s.userId);let d=gn(this.serializer,u);return yg(e,s.userId,d).next(()=>{})}))}))}ui(e){let t=e.store(or),r=e.store(pn);return e.store(En).get(Eo).next(i=>{let s=[];return r.Z((a,c)=>{let u=new ae(a),d=function(g){return[0,Ce(g)]}(u);s.push(t.get(d).next(f=>f?A.resolve():(g=>t.put({targetId:0,path:Ce(g),sequenceNumber:i.highestListenSequenceNumber}))(u)))}).next(()=>A.waitFor(s))})}ci(e,t){e.createObjectStore(bi,{keyPath:YT});let r=t.store(bi),i=new Oi,s=a=>{if(i.add(a)){let c=a.lastSegment(),u=a.popLast();return r.put({collectionId:c,parent:Ce(u)})}};return t.store(pn).Z({Y:!0},(a,c)=>{let u=new ae(a);return s(u.popLast())}).next(()=>t.store(ir).Z({Y:!0},([a,c,u],d)=>{let f=ot(c);return s(f.popLast())}))}li(e){let t=e.store(sr);return t.Z((r,i)=>{let s=pi(i),a=fg(this.serializer,s);return t.put(a)})}hi(e,t){let r=t.store(pn),i=[];return r.Z((s,a)=>{let c=t.store(To),u=function(g){return g.document?new V(ae.fromString(g.document.name).popFirst(5)):g.noDocument?V.fromSegments(g.noDocument.path):g.unknownDocument?V.fromSegments(g.unknownDocument.path):F()}(a).path.toArray(),d={prefixPath:u.slice(0,u.length-2),collectionGroup:u[u.length-2],documentId:u[u.length-1],readTime:a.readTime||[0,0],unknownDocument:a.unknownDocument,noDocument:a.noDocument,document:a.document,hasCommittedMutations:!!a.hasCommittedMutations};i.push(c.put(d))}).next(()=>A.waitFor(i))}Pi(e,t){let r=t.store(Qe),i=Tg(this.serializer),s=new $o(Ko.ri,this.serializer.Tt);return r.G().next(a=>{let c=new Map;return a.forEach(u=>{var d;let f=(d=c.get(u.userId))!==null&&d!==void 0?d:we();gn(this.serializer,u).keys().forEach(g=>f=f.add(g)),c.set(u.userId,f)}),A.forEach(c,(u,d)=>{let f=new ge(d),g=Mo.It(this.serializer,f),b=s.getIndexManager(f),R=qo.It(f,this.serializer,b,s.referenceDelegate);return new zo(i,R,g,b).recalculateAndSaveOverlaysForDocumentKeys(new Ai(t,Me.ae),u).next()})})}};function dm(n){n.createObjectStore(or,{keyPath:WT}).createIndex($l,QT,{unique:!0}),n.createObjectStore(sr,{keyPath:"targetId"}).createIndex(Pm,HT,{unique:!0}),n.createObjectStore(En)}var Mt="IndexedDbPersistence",su=18e5,ou=5e3,au="Failed to obtain exclusive access to the persistence layer. To allow shared access, multi-tab synchronization has to be enabled in all tabs. If you are using `experimentalForceOwningTab:true`, make sure that only one tab has persistence enabled at any given time.",sb="main",yl=class n{constructor(e,t,r,i,s,a,c,u,d,f,g=17){if(this.allowTabSynchronization=e,this.persistenceKey=t,this.clientId=r,this.Ti=s,this.window=a,this.document=c,this.Ii=d,this.Ei=f,this.di=g,this.Gr=null,this.zr=!1,this.isPrimary=!1,this.networkEnabled=!0,this.Ai=null,this.inForeground=!1,this.Ri=null,this.Vi=null,this.mi=Number.NEGATIVE_INFINITY,this.fi=b=>Promise.resolve(),!n.D())throw new M(P.UNIMPLEMENTED,"This platform is either missing IndexedDB or is known to have an incomplete implementation. Offline persistence has been disabled.");this.referenceDelegate=new sl(this,i),this.gi=t+sb,this.serializer=new Vo(u),this.pi=new rr(this.gi,this.di,new _l(this.serializer)),this.jr=new Gu,this.Hr=new tl(this.referenceDelegate,this.serializer),this.remoteDocumentCache=Tg(this.serializer),this.Yr=new Ku,this.window&&this.window.localStorage?this.yi=this.window.localStorage:(this.yi=null,f===!1&&je(Mt,"LocalStorage is unavailable. As a result, persistence may not work reliably. In particular enablePersistence() could fail immediately after refreshing the page."))}start(){return this.wi().then(()=>{if(!this.isPrimary&&!this.allowTabSynchronization)throw new M(P.FAILED_PRECONDITION,au);return this.Si(),this.bi(),this.Di(),this.runTransaction("getHighestListenSequenceNumber","readonly",e=>this.Hr.getHighestSequenceNumber(e))}).then(e=>{this.Gr=new Me(e,this.Ii)}).then(()=>{this.zr=!0}).catch(e=>(this.pi&&this.pi.close(),Promise.reject(e)))}Ci(e){return this.fi=async t=>{if(this.started)return e(t)},e(this.isPrimary)}setDatabaseDeletedListener(e){this.pi.k(async t=>{t.newVersion===null&&await e()})}setNetworkEnabled(e){this.networkEnabled!==e&&(this.networkEnabled=e,this.Ti.enqueueAndForget(async()=>{this.started&&await this.wi()}))}wi(){return this.runTransaction("updateClientMetadataAndTryBecomePrimary","readwrite",e=>oo(e).put({clientId:this.clientId,updateTimeMs:Date.now(),networkEnabled:this.networkEnabled,inForeground:this.inForeground}).next(()=>{if(this.isPrimary)return this.Fi(e).next(t=>{t||(this.isPrimary=!1,this.Ti.enqueueRetryable(()=>this.fi(!1)))})}).next(()=>this.Mi(e)).next(t=>this.isPrimary&&!t?this.xi(e).next(()=>!1):!!t&&this.Oi(e).next(()=>!0))).catch(e=>{if(yr(e))return D(Mt,"Failed to extend owner lease: ",e),this.isPrimary;if(!this.allowTabSynchronization)throw e;return D(Mt,"Releasing owner lease after error during lease refresh",e),!1}).then(e=>{this.isPrimary!==e&&this.Ti.enqueueRetryable(()=>this.fi(e)),this.isPrimary=e})}Fi(e){return fi(e).get(zn).next(t=>A.resolve(this.Ni(t)))}Bi(e){return oo(e).delete(this.clientId)}async Li(){if(this.isPrimary&&!this.ki(this.mi,su)){this.mi=Date.now();let e=await this.runTransaction("maybeGarbageCollectMultiClientState","readwrite-primary",t=>{let r=fe(t,ar);return r.G().next(i=>{let s=this.qi(i,su),a=i.filter(c=>s.indexOf(c)===-1);return A.forEach(a,c=>r.delete(c.clientId)).next(()=>a)})}).catch(()=>[]);if(this.yi)for(let t of e)this.yi.removeItem(this.Qi(t.clientId))}}Di(){this.Vi=this.Ti.enqueueAfterDelay("client_metadata_refresh",4e3,()=>this.wi().then(()=>this.Li()).then(()=>this.Di()))}Ni(e){return!!e&&e.ownerId===this.clientId}Mi(e){return this.Ei?A.resolve(!0):fi(e).get(zn).next(t=>{if(t!==null&&this.ki(t.leaseTimestampMs,ou)&&!this.$i(t.ownerId)){if(this.Ni(t)&&this.networkEnabled)return!0;if(!this.Ni(t)){if(!t.allowTabSynchronization)throw new M(P.FAILED_PRECONDITION,au);return!1}}return!(!this.networkEnabled||!this.inForeground)||oo(e).G().next(r=>this.qi(r,ou).find(i=>{if(this.clientId!==i.clientId){let s=!this.networkEnabled&&i.networkEnabled,a=!this.inForeground&&i.inForeground,c=this.networkEnabled===i.networkEnabled;if(s||a&&c)return!0}return!1})===void 0)}).next(t=>(this.isPrimary!==t&&D(Mt,`Client ${t?"is":"is not"} eligible for a primary lease.`),t))}async shutdown(){this.zr=!1,this.Ki(),this.Vi&&(this.Vi.cancel(),this.Vi=null),this.Ui(),this.Wi(),await this.pi.runTransaction("shutdown","readwrite",[Mi,ar],e=>{let t=new Ai(e,Me.ae);return this.xi(t).next(()=>this.Bi(t))}),this.pi.close(),this.Gi()}qi(e,t){return e.filter(r=>this.ki(r.updateTimeMs,t)&&!this.$i(r.clientId))}zi(){return this.runTransaction("getActiveClients","readonly",e=>oo(e).G().next(t=>this.qi(t,su).map(r=>r.clientId)))}get started(){return this.zr}getGlobalsCache(){return this.jr}getMutationQueue(e,t){return qo.It(e,this.serializer,t,this.referenceDelegate)}getTargetCache(){return this.Hr}getRemoteDocumentCache(){return this.remoteDocumentCache}getIndexManager(e){return new el(e,this.serializer.Tt.databaseId)}getDocumentOverlayCache(e){return Mo.It(this.serializer,e)}getBundleCache(){return this.Yr}runTransaction(e,t,r){D(Mt,"Starting transaction:",e);let i=t==="readonly"?"readonly":"readwrite",s=function(u){return u===17?dE:u===16?hE:u===15?Hl:u===14?xm:u===13?Om:u===12?lE:u===11?Nm:void F()}(this.di),a;return this.pi.runTransaction(e,i,s,c=>(a=new Ai(c,this.Gr?this.Gr.next():Me.ae),t==="readwrite-primary"?this.Fi(a).next(u=>!!u||this.Mi(a)).next(u=>{if(!u)throw je(`Failed to obtain primary lease for action '${e}'.`),this.isPrimary=!1,this.Ti.enqueueRetryable(()=>this.fi(!1)),new M(P.FAILED_PRECONDITION,bm);return r(a)}).next(u=>this.Oi(a).next(()=>u)):this.ji(a).next(()=>r(a)))).then(c=>(a.raiseOnCommittedEvent(),c))}ji(e){return fi(e).get(zn).next(t=>{if(t!==null&&this.ki(t.leaseTimestampMs,ou)&&!this.$i(t.ownerId)&&!this.Ni(t)&&!(this.Ei||this.allowTabSynchronization&&t.allowTabSynchronization))throw new M(P.FAILED_PRECONDITION,au)})}Oi(e){let t={ownerId:this.clientId,allowTabSynchronization:this.allowTabSynchronization,leaseTimestampMs:Date.now()};return fi(e).put(zn,t)}static D(){return rr.D()}xi(e){let t=fi(e);return t.get(zn).next(r=>this.Ni(r)?(D(Mt,"Releasing primary lease."),t.delete(zn)):A.resolve())}ki(e,t){let r=Date.now();return!(e<r-t)&&(!(e>r)||(je(`Detected an update time that is in the future: ${e} > ${r}`),!1))}Si(){this.document!==null&&typeof this.document.addEventListener=="function"&&(this.Ri=()=>{this.Ti.enqueueAndForget(()=>(this.inForeground=this.document.visibilityState==="visible",this.wi()))},this.document.addEventListener("visibilitychange",this.Ri),this.inForeground=this.document.visibilityState==="visible")}Ui(){this.Ri&&(this.document.removeEventListener("visibilitychange",this.Ri),this.Ri=null)}bi(){var e;typeof((e=this.window)===null||e===void 0?void 0:e.addEventListener)=="function"&&(this.Ai=()=>{this.Ki();let t=/(?:Version|Mobile)\/1[456]/;$a()&&(navigator.appVersion.match(t)||navigator.userAgent.match(t))&&this.Ti.enterRestrictedMode(!0),this.Ti.enqueueAndForget(()=>this.shutdown())},this.window.addEventListener("pagehide",this.Ai))}Wi(){this.Ai&&(this.window.removeEventListener("pagehide",this.Ai),this.Ai=null)}$i(e){var t;try{let r=((t=this.yi)===null||t===void 0?void 0:t.getItem(this.Qi(e)))!==null;return D(Mt,`Client '${e}' ${r?"is":"is not"} zombied in LocalStorage`),r}catch(r){return je(Mt,"Failed to get zombied client id.",r),!1}}Ki(){if(this.yi)try{this.yi.setItem(this.Qi(this.clientId),String(Date.now()))}catch(e){je("Failed to set zombie client id.",e)}}Gi(){if(this.yi)try{this.yi.removeItem(this.Qi(this.clientId))}catch{}}Qi(e){return`firestore_zombie_${this.persistenceKey}_${e}`}};function fi(n){return fe(n,Mi)}function oo(n){return fe(n,ar)}function ob(n,e){let t=n.projectId;return n.isDefaultDatabase||(t+="."+n.database),"firestore/"+e+"/"+t+"/"}var wl=class n{constructor(e,t,r,i){this.targetId=e,this.fromCache=t,this.Hi=r,this.Ji=i}static Yi(e,t){let r=we(),i=we();for(let s of t.docChanges)switch(s.type){case 0:r=r.add(s.doc.key);break;case 1:i=i.add(s.doc.key)}return new n(e,t.fromCache,r,i)}};var vl=class{constructor(){this._documentReadCount=0}get documentReadCount(){return this._documentReadCount}incrementDocumentReadCount(e){this._documentReadCount+=e}};var Go=class{constructor(){this.Zi=!1,this.Xi=!1,this.es=100,this.ts=function(){return $a()?8:Am(se())>0?6:4}()}initialize(e,t){this.ns=e,this.indexManager=t,this.Zi=!0}getDocumentsMatchingQuery(e,t,r,i){let s={result:null};return this.rs(e,t).next(a=>{s.result=a}).next(()=>{if(!s.result)return this.ss(e,t,i,r).next(a=>{s.result=a})}).next(()=>{if(s.result)return;let a=new vl;return this._s(e,t,a).next(c=>{if(s.result=c,this.Xi)return this.us(e,t,a,c.size)})}).next(()=>s.result)}us(e,t,r,i){return r.documentReadCount<this.es?(Qn()<=j.DEBUG&&D("QueryEngine","SDK will not create cache indexes for query:",ui(t),"since it only creates cache indexes for collection contains","more than or equal to",this.es,"documents"),A.resolve()):(Qn()<=j.DEBUG&&D("QueryEngine","Query:",ui(t),"scans",r.documentReadCount,"local documents and returns",i,"documents as results."),r.documentReadCount>this.ts*i?(Qn()<=j.DEBUG&&D("QueryEngine","The SDK decides to create cache indexes for query:",ui(t),"as using cache indexes may help improve performance."),this.indexManager.createTargetIndexes(e,At(t))):A.resolve())}rs(e,t){if(jp(t))return A.resolve(null);let r=At(t);return this.indexManager.getIndexType(e,r).next(i=>i===0?null:(t.limit!==null&&i===1&&(t=Lu(t,null,"F"),r=At(t)),this.indexManager.getDocumentsMatchingTarget(e,r).next(s=>{let a=we(...s);return this.ns.getDocuments(e,a).next(c=>this.indexManager.getMinOffset(e,r).next(u=>{let d=this.cs(t,c);return this.ls(t,d,a,u.readTime)?this.rs(e,Lu(t,null,"F")):this.hs(e,d,t,u)}))})))}ss(e,t,r,i){return jp(t)||i.isEqual(Q.min())?A.resolve(null):this.ns.getDocuments(e,r).next(s=>{let a=this.cs(t,s);return this.ls(t,a,r,i)?A.resolve(null):(Qn()<=j.DEBUG&&D("QueryEngine","Re-using previous result from %s to execute query: %s",i.toString(),ui(t)),this.hs(e,a,t,BT(i,vi)).next(c=>c))})}cs(e,t){let r=new Z(EE(e));return t.forEach((i,s)=>{oa(e,s)&&(r=r.add(s))}),r}ls(e,t,r,i){if(e.limit===null)return!1;if(r.size!==t.size)return!0;let s=e.limitType==="F"?t.last():t.first();return!!s&&(s.hasPendingWrites||s.version.compareTo(i)>0)}_s(e,t,r){return Qn()<=j.DEBUG&&D("QueryEngine","Using full collection scan to execute query:",ui(t)),this.ns.getDocumentsMatchingQuery(e,t,$e.min(),r)}hs(e,t,r,i){return this.ns.getDocumentsMatchingQuery(e,r,i).next(s=>(t.forEach(a=>{s=s.insert(a.key,a)}),s))}};var ab="LocalStore";var Il=class{constructor(e,t,r,i){this.persistence=e,this.Ps=t,this.serializer=i,this.Ts=new Fe($),this.Is=new lt(s=>An(s),Fi),this.Es=new Map,this.ds=e.getRemoteDocumentCache(),this.Hr=e.getTargetCache(),this.Yr=e.getBundleCache(),this.As(r)}As(e){this.documentOverlayCache=this.persistence.getDocumentOverlayCache(e),this.indexManager=this.persistence.getIndexManager(e),this.mutationQueue=this.persistence.getMutationQueue(e,this.indexManager),this.localDocuments=new zo(this.ds,this.mutationQueue,this.documentOverlayCache,this.indexManager),this.ds.setIndexManager(this.indexManager),this.Ps.initialize(this.localDocuments,this.indexManager)}collectGarbage(e){return this.persistence.runTransaction("Collect garbage","readwrite-primary",t=>e.collect(t,this.Ts))}};function Eg(n,e,t,r){return new Il(n,e,t,r)}async function cb(n,e){let t=ne(n);return await t.persistence.runTransaction("Handle user change","readonly",r=>{let i;return t.mutationQueue.getAllMutationBatches(r).next(s=>(i=s,t.As(e),t.mutationQueue.getAllMutationBatches(r))).next(s=>{let a=[],c=[],u=we();for(let d of i){a.push(d.batchId);for(let f of d.mutations)u=u.add(f.key)}for(let d of s){c.push(d.batchId);for(let f of d.mutations)u=u.add(f.key)}return t.localDocuments.getDocuments(r,u).next(d=>({Rs:d,removedBatchIds:a,addedBatchIds:c}))})})}function ub(n,e){let t=ne(n);return t.persistence.runTransaction("Acknowledge batch","readwrite-primary",r=>{let i=e.batch.keys(),s=t.ds.newChangeBuffer({trackRemovals:!0});return function(c,u,d,f){let g=d.batch,b=g.keys(),R=A.resolve();return b.forEach(k=>{R=R.next(()=>f.getEntry(u,k)).next(O=>{let N=d.docVersions.get(k);U(N!==null),O.version.compareTo(N)<0&&(g.applyToRemoteDocument(O,d),O.isValidDocument()&&(O.setReadTime(d.commitVersion),f.addEntry(O)))})}),R.next(()=>c.mutationQueue.removeMutationBatch(u,g))}(t,r,e,s).next(()=>s.apply(r)).next(()=>t.mutationQueue.performConsistencyCheck(r)).next(()=>t.documentOverlayCache.removeOverlaysForBatchId(r,i,e.batch.batchId)).next(()=>t.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(r,function(c){let u=we();for(let d=0;d<c.mutationResults.length;++d)c.mutationResults[d].transformResults.length>0&&(u=u.add(c.batch.mutations[d].key));return u}(e))).next(()=>t.localDocuments.getDocuments(r,i))})}function lb(n){let e=ne(n);return e.persistence.runTransaction("Get last remote snapshot version","readonly",t=>e.Hr.getLastRemoteSnapshotVersion(t))}function hb(n,e){let t=ne(n);return t.persistence.runTransaction("Get next mutation batch","readonly",r=>(e===void 0&&(e=Tn),t.mutationQueue.getNextMutationBatchAfterBatchId(r,e)))}var Ho=class{constructor(){this.activeTargetIds=CE()}Ds(e){this.activeTargetIds=this.activeTargetIds.add(e)}vs(e){this.activeTargetIds=this.activeTargetIds.delete(e)}bs(){let e={activeTargetIds:this.activeTargetIds.toArray(),updateTimeMs:Date.now()};return JSON.stringify(e)}};var Wo=class{constructor(){this.ho=new Ho,this.Po={},this.onlineStateHandler=null,this.sequenceNumberHandler=null}addPendingMutation(e){}updateMutationState(e,t,r){}addLocalQueryTarget(e,t=!0){return t&&this.ho.Ds(e),this.Po[e]||"not-current"}updateQueryState(e,t,r){this.Po[e]=t}removeLocalQueryTarget(e){this.ho.vs(e)}isLocalQueryTarget(e){return this.ho.activeTargetIds.has(e)}clearQueryState(e){delete this.Po[e]}getAllActiveQueryTargets(){return this.ho.activeTargetIds}isActiveQueryTarget(e){return this.ho.activeTargetIds.has(e)}start(){return this.ho=new Ho,Promise.resolve()}handleUserChange(e,t,r){}setOnlineState(e){}shutdown(){}writeSequenceNumber(e){}notifyBundleLoaded(e){}};var Tl=class{To(e){}shutdown(){}};var fm="ConnectivityMonitor",Qo=class{constructor(){this.Io=()=>this.Eo(),this.Ao=()=>this.Ro(),this.Vo=[],this.mo()}To(e){this.Vo.push(e)}shutdown(){window.removeEventListener("online",this.Io),window.removeEventListener("offline",this.Ao)}mo(){window.addEventListener("online",this.Io),window.addEventListener("offline",this.Ao)}Eo(){D(fm,"Network connectivity changed: AVAILABLE");for(let e of this.Vo)e(0)}Ro(){D(fm,"Network connectivity changed: UNAVAILABLE");for(let e of this.Vo)e(1)}static D(){return typeof window<"u"&&window.addEventListener!==void 0&&window.removeEventListener!==void 0}};var ao=null;function El(){return ao===null?ao=function(){return 268435456+Math.round(2147483648*Math.random())}():ao++,"0x"+ao.toString(16)}var cu="RestConnection",db={BatchGetDocuments:"batchGet",Commit:"commit",RunQuery:"runQuery",RunAggregationQuery:"runAggregationQuery"},bl=class{get fo(){return!1}constructor(e){this.databaseInfo=e,this.databaseId=e.databaseId;let t=e.ssl?"https":"http",r=encodeURIComponent(this.databaseId.projectId),i=encodeURIComponent(this.databaseId.database);this.po=t+"://"+e.host,this.yo=`projects/${r}/databases/${i}`,this.wo=this.databaseId.database===Si?`project_id=${r}`:`project_id=${r}&database_id=${i}`}So(e,t,r,i,s){let a=El(),c=this.bo(e,t.toUriEncodedString());D(cu,`Sending RPC '${e}' ${a}:`,c,r);let u={"google-cloud-resource-prefix":this.yo,"x-goog-request-params":this.wo};return this.Do(u,i,s),this.vo(e,c,u,r).then(d=>(D(cu,`Received RPC '${e}' ${a}: `,d),d),d=>{throw Bl(cu,`RPC '${e}' ${a} failed with error: `,d,"url: ",c,"request:",r),d})}Co(e,t,r,i,s,a){return this.So(e,t,r,i,s)}Do(e,t,r){e["X-Goog-Api-Client"]=function(){return"gl-js/ fire/"+_r}(),e["Content-Type"]="text/plain",this.databaseInfo.appId&&(e["X-Firebase-GMPID"]=this.databaseInfo.appId),t&&t.headers.forEach((i,s)=>e[s]=i),r&&r.headers.forEach((i,s)=>e[s]=i)}bo(e,t){let r=db[e];return`${this.po}/v1/${t}:${r}`}terminate(){}};var Al=class{constructor(e){this.Fo=e.Fo,this.Mo=e.Mo}xo(e){this.Oo=e}No(e){this.Bo=e}Lo(e){this.ko=e}onMessage(e){this.qo=e}close(){this.Mo()}send(e){this.Fo(e)}Qo(){this.Oo()}$o(){this.Bo()}Ko(e){this.ko(e)}Uo(e){this.qo(e)}};var Ae="WebChannelConnection",Sl=class extends bl{constructor(e){super(e),this.forceLongPolling=e.forceLongPolling,this.autoDetectLongPolling=e.autoDetectLongPolling,this.useFetchStreams=e.useFetchStreams,this.longPollingOptions=e.longPollingOptions}vo(e,t,r,i){let s=El();return new Promise((a,c)=>{let u=new Xc;u.setWithCredentials(!0),u.listenOnce(Zc.COMPLETE,()=>{try{switch(u.getLastErrorCode()){case ci.NO_ERROR:let f=u.getResponseJson();D(Ae,`XHR for RPC '${e}' ${s} received:`,JSON.stringify(f)),a(f);break;case ci.TIMEOUT:D(Ae,`RPC '${e}' ${s} timed out`),c(new M(P.DEADLINE_EXCEEDED,"Request time out"));break;case ci.HTTP_ERROR:let g=u.getStatus();if(D(Ae,`RPC '${e}' ${s} failed with status:`,g,"response text:",u.getResponseText()),g>0){let b=u.getResponseJson();Array.isArray(b)&&(b=b[0]);let R=b?.error;if(R&&R.status&&R.message){let k=function(N){let Y=N.toLowerCase().replace(/_/g,"-");return Object.values(P).indexOf(Y)>=0?Y:P.UNKNOWN}(R.status);c(new M(k,R.message))}else c(new M(P.UNKNOWN,"Server responded with status "+u.getStatus()))}else c(new M(P.UNAVAILABLE,"Connection failed."));break;default:F()}}finally{D(Ae,`RPC '${e}' ${s} completed.`)}});let d=JSON.stringify(i);D(Ae,`RPC '${e}' ${s} sending request:`,i),u.send(t,"POST",d,r,15)})}Wo(e,t,r){let i=El(),s=[this.po,"/","google.firestore.v1.Firestore","/",e,"/channel"],a=nu(),c=tu(),u={httpSessionIdParam:"gsessionid",initMessageHeaders:{},messageUrlParams:{database:`projects/${this.databaseId.projectId}/databases/${this.databaseId.database}`},sendRawJson:!0,supportsCrossDomainXhr:!0,internalChannelParams:{forwardChannelRequestTimeoutMs:6e5},forceLongPolling:this.forceLongPolling,detectBufferingProxy:this.autoDetectLongPolling},d=this.longPollingOptions.timeoutSeconds;d!==void 0&&(u.longPollingTimeout=Math.round(1e3*d)),this.useFetchStreams&&(u.useFetchStreams=!0),this.Do(u.initMessageHeaders,t,r),u.encodeInitMessageHeaders=!0;let f=s.join("");D(Ae,`Creating RPC '${e}' stream ${i}: ${f}`,u);let g=a.createWebChannel(f,u),b=!1,R=!1,k=new Al({Fo:N=>{R?D(Ae,`Not sending because RPC '${e}' stream ${i} is closed:`,N):(b||(D(Ae,`Opening RPC '${e}' stream ${i} transport.`),g.open(),b=!0),D(Ae,`RPC '${e}' stream ${i} sending:`,N),g.send(N))},Mo:()=>g.close()}),O=(N,Y,z)=>{N.listen(Y,L=>{try{z(L)}catch(B){setTimeout(()=>{throw B},0)}})};return O(g,jn.EventType.OPEN,()=>{R||(D(Ae,`RPC '${e}' stream ${i} transport opened.`),k.Qo())}),O(g,jn.EventType.CLOSE,()=>{R||(R=!0,D(Ae,`RPC '${e}' stream ${i} transport closed`),k.Ko())}),O(g,jn.EventType.ERROR,N=>{R||(R=!0,Bl(Ae,`RPC '${e}' stream ${i} transport errored:`,N),k.Ko(new M(P.UNAVAILABLE,"The operation could not be completed")))}),O(g,jn.EventType.MESSAGE,N=>{var Y;if(!R){let z=N.data[0];U(!!z);let L=z,B=L?.error||((Y=L[0])===null||Y===void 0?void 0:Y.error);if(B){D(Ae,`RPC '${e}' stream ${i} received error:`,B);let H=B.status,q=function(y){let v=ce[y];if(v!==void 0)return UE(v)}(H),w=B.message;q===void 0&&(q=P.INTERNAL,w="Unknown error status: "+H+" with message "+B.message),R=!0,k.Ko(new M(q,w)),g.close()}else D(Ae,`RPC '${e}' stream ${i} received:`,z),k.Uo(z)}}),O(c,eu.STAT_EVENT,N=>{N.stat===no.PROXY?D(Ae,`RPC '${e}' stream ${i} detected buffering proxy`):N.stat===no.NOPROXY&&D(Ae,`RPC '${e}' stream ${i} detected no buffering proxy`)}),setTimeout(()=>{k.$o()},0),k}};function fb(){return typeof window<"u"?window:null}function po(){return typeof document<"u"?document:null}function bg(n){return new Bu(n,!0)}var Yo=class{constructor(e,t,r=1e3,i=1.5,s=6e4){this.Ti=e,this.timerId=t,this.Go=r,this.zo=i,this.jo=s,this.Ho=0,this.Jo=null,this.Yo=Date.now(),this.reset()}reset(){this.Ho=0}Zo(){this.Ho=this.jo}Xo(e){this.cancel();let t=Math.floor(this.Ho+this.e_()),r=Math.max(0,Date.now()-this.Yo),i=Math.max(0,t-r);i>0&&D("ExponentialBackoff",`Backing off for ${i} ms (base delay: ${this.Ho} ms, delay with jitter: ${t} ms, last attempt: ${r} ms ago)`),this.Jo=this.Ti.enqueueAfterDelay(this.timerId,i,()=>(this.Yo=Date.now(),e())),this.Ho*=this.zo,this.Ho<this.Go&&(this.Ho=this.Go),this.Ho>this.jo&&(this.Ho=this.jo)}t_(){this.Jo!==null&&(this.Jo.skipDelay(),this.Jo=null)}cancel(){this.Jo!==null&&(this.Jo.cancel(),this.Jo=null)}e_(){return(Math.random()-.5)*this.Ho}};var pm="PersistentStream",Rl=class{constructor(e,t,r,i,s,a,c,u){this.Ti=e,this.n_=r,this.r_=i,this.connection=s,this.authCredentialsProvider=a,this.appCheckCredentialsProvider=c,this.listener=u,this.state=0,this.i_=0,this.s_=null,this.o_=null,this.stream=null,this.__=0,this.a_=new Yo(e,t)}u_(){return this.state===1||this.state===5||this.c_()}c_(){return this.state===2||this.state===3}start(){this.__=0,this.state!==4?this.auth():this.l_()}async stop(){this.u_()&&await this.close(0)}h_(){this.state=0,this.a_.reset()}P_(){this.c_()&&this.s_===null&&(this.s_=this.Ti.enqueueAfterDelay(this.n_,6e4,()=>this.T_()))}I_(e){this.E_(),this.stream.send(e)}async T_(){if(this.c_())return this.close(0)}E_(){this.s_&&(this.s_.cancel(),this.s_=null)}d_(){this.o_&&(this.o_.cancel(),this.o_=null)}async close(e,t){this.E_(),this.d_(),this.a_.cancel(),this.i_++,e!==4?this.a_.reset():t&&t.code===P.RESOURCE_EXHAUSTED?(je(t.toString()),je("Using maximum backoff delay to prevent overloading the backend."),this.a_.Zo()):t&&t.code===P.UNAUTHENTICATED&&this.state!==3&&(this.authCredentialsProvider.invalidateToken(),this.appCheckCredentialsProvider.invalidateToken()),this.stream!==null&&(this.A_(),this.stream.close(),this.stream=null),this.state=e,await this.listener.Lo(t)}A_(){}auth(){this.state=1;let e=this.R_(this.i_),t=this.i_;Promise.all([this.authCredentialsProvider.getToken(),this.appCheckCredentialsProvider.getToken()]).then(([r,i])=>{this.i_===t&&this.V_(r,i)},r=>{e(()=>{let i=new M(P.UNKNOWN,"Fetching auth token failed: "+r.message);return this.m_(i)})})}V_(e,t){let r=this.R_(this.i_);this.stream=this.f_(e,t),this.stream.xo(()=>{r(()=>this.listener.xo())}),this.stream.No(()=>{r(()=>(this.state=2,this.o_=this.Ti.enqueueAfterDelay(this.r_,1e4,()=>(this.c_()&&(this.state=3),Promise.resolve())),this.listener.No()))}),this.stream.Lo(i=>{r(()=>this.m_(i))}),this.stream.onMessage(i=>{r(()=>++this.__==1?this.g_(i):this.onNext(i))})}l_(){this.state=5,this.a_.Xo(async()=>{this.state=0,this.start()})}m_(e){return D(pm,`close with error: ${e}`),this.stream=null,this.close(4,e)}R_(e){return t=>{this.Ti.enqueueAndForget(()=>this.i_===e?t():(D(pm,"stream callback skipped by getCloseGuardedDispatcher."),Promise.resolve()))}}};var Pl=class extends Rl{constructor(e,t,r,i,s,a){super(e,"write_stream_connection_backoff","write_stream_idle","health_check_timeout",t,r,i,a),this.serializer=s}get S_(){return this.__>0}start(){this.lastStreamToken=void 0,super.start()}A_(){this.S_&&this.b_([])}f_(e,t){return this.connection.Wo("Write",e,t)}g_(e){return U(!!e.streamToken),this.lastStreamToken=e.streamToken,U(!e.writeResults||e.writeResults.length===0),this.listener.D_()}onNext(e){U(!!e.streamToken),this.lastStreamToken=e.streamToken,this.a_.reset();let t=HE(e.writeResults,e.commitTime),r=Ye(e.commitTime);return this.listener.v_(r,t)}C_(){let e={};e.database=KE(this.serializer),this.I_(e)}b_(e){let t={streamToken:this.lastStreamToken,writes:e.map(r=>xo(this.serializer,r))};this.I_(t)}};var kl=class{},Cl=class extends kl{constructor(e,t,r,i){super(),this.authCredentials=e,this.appCheckCredentials=t,this.connection=r,this.serializer=i,this.F_=!1}M_(){if(this.F_)throw new M(P.FAILED_PRECONDITION,"The client has already been terminated.")}So(e,t,r,i){return this.M_(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then(([s,a])=>this.connection.So(e,ju(t,r),i,s,a)).catch(s=>{throw s.name==="FirebaseError"?(s.code===P.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),s):new M(P.UNKNOWN,s.toString())})}Co(e,t,r,i,s){return this.M_(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then(([a,c])=>this.connection.Co(e,ju(t,r),i,a,c,s)).catch(a=>{throw a.name==="FirebaseError"?(a.code===P.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),a):new M(P.UNKNOWN,a.toString())})}terminate(){this.F_=!0,this.connection.terminate()}},Dl=class{constructor(e,t){this.asyncQueue=e,this.onlineStateHandler=t,this.state="Unknown",this.x_=0,this.O_=null,this.N_=!0}B_(){this.x_===0&&(this.L_("Unknown"),this.O_=this.asyncQueue.enqueueAfterDelay("online_state_timeout",1e4,()=>(this.O_=null,this.k_("Backend didn't respond within 10 seconds."),this.L_("Offline"),Promise.resolve())))}q_(e){this.state==="Online"?this.L_("Unknown"):(this.x_++,this.x_>=1&&(this.Q_(),this.k_(`Connection failed 1 times. Most recent error: ${e.toString()}`),this.L_("Offline")))}set(e){this.Q_(),this.x_=0,e==="Online"&&(this.N_=!1),this.L_(e)}L_(e){e!==this.state&&(this.state=e,this.onlineStateHandler(e))}k_(e){let t=`Could not reach Cloud Firestore backend. ${e}
This typically indicates that your device does not have a healthy Internet connection at the moment. The client will operate in offline mode until it is able to successfully connect to the backend.`;this.N_?(je(t),this.N_=!1):D("OnlineStateTracker",t)}Q_(){this.O_!==null&&(this.O_.cancel(),this.O_=null)}};var aa="RemoteStore",Nl=class{constructor(e,t,r,i,s){this.localStore=e,this.datastore=t,this.asyncQueue=r,this.remoteSyncer={},this.K_=[],this.U_=new Map,this.W_=new Set,this.G_=[],this.z_=s,this.z_.To(a=>{r.enqueueAndForget(async()=>{ua(this)&&(D(aa,"Restarting streams for network reachability change."),await async function(u){let d=ne(u);d.W_.add(4),await ca(d),d.j_.set("Unknown"),d.W_.delete(4),await Zl(d)}(this))})}),this.j_=new Dl(r,i)}};async function Zl(n){if(ua(n))for(let e of n.G_)await e(!0)}async function ca(n){for(let e of n.G_)await e(!1)}function ua(n){return ne(n).W_.size===0}async function Ag(n,e,t){if(!yr(e))throw e;n.W_.add(1),await ca(n),n.j_.set("Offline"),t||(t=()=>lb(n.localStore)),n.asyncQueue.enqueueRetryable(async()=>{D(aa,"Retrying IndexedDB access"),await t(),n.W_.delete(1),await Zl(n)})}function Sg(n,e){return e().catch(t=>Ag(n,t,e))}async function la(n){let e=ne(n),t=Wt(e),r=e.K_.length>0?e.K_[e.K_.length-1].batchId:Tn;for(;pb(e);)try{let i=await hb(e.localStore,r);if(i===null){e.K_.length===0&&t.P_();break}r=i.batchId,mb(e,i)}catch(i){await Ag(e,i)}Rg(e)&&Pg(e)}function pb(n){return ua(n)&&n.K_.length<10}function mb(n,e){n.K_.push(e);let t=Wt(n);t.c_()&&t.S_&&t.b_(e.mutations)}function Rg(n){return ua(n)&&!Wt(n).u_()&&n.K_.length>0}function Pg(n){Wt(n).start()}async function gb(n){Wt(n).C_()}async function _b(n){let e=Wt(n);for(let t of n.K_)e.b_(t.mutations)}async function yb(n,e,t){let r=n.K_.shift(),i=Uu.from(r,e,t);await Sg(n,()=>n.remoteSyncer.applySuccessfulWrite(i)),await la(n)}async function wb(n,e){e&&Wt(n).S_&&await async function(r,i){if(function(a){return FE(a)&&a!==P.ABORTED}(i.code)){let s=r.K_.shift();Wt(r).h_(),await Sg(r,()=>r.remoteSyncer.rejectFailedWrite(s.batchId,i)),await la(r)}}(n,e),Rg(n)&&Pg(n)}async function vb(n,e){let t=ne(n);e?(t.W_.delete(2),await Zl(t)):e||(t.W_.add(2),await ca(t),t.j_.set("Unknown"))}function Wt(n){return n.Y_||(n.Y_=function(t,r,i){let s=ne(t);return s.M_(),new Pl(r,s.connection,s.authCredentials,s.appCheckCredentials,s.serializer,i)}(n.datastore,n.asyncQueue,{xo:()=>Promise.resolve(),No:gb.bind(null,n),Lo:wb.bind(null,n),D_:_b.bind(null,n),v_:yb.bind(null,n)}),n.G_.push(async e=>{e?(n.Y_.h_(),await la(n)):(await n.Y_.stop(),n.K_.length>0&&(D(aa,`Stopping write stream with ${n.K_.length} pending writes`),n.K_=[]))})),n.Y_}var Ol=class n{constructor(e,t,r,i,s){this.asyncQueue=e,this.timerId=t,this.targetTimeMs=r,this.op=i,this.removalCallback=s,this.deferred=new qt,this.then=this.deferred.promise.then.bind(this.deferred.promise),this.deferred.promise.catch(a=>{})}get promise(){return this.deferred.promise}static createAndSchedule(e,t,r,i,s){let a=Date.now()+r,c=new n(e,t,a,i,s);return c.start(r),c}start(e){this.timerHandle=setTimeout(()=>this.handleDelayElapsed(),e)}skipDelay(){return this.handleDelayElapsed()}cancel(e){this.timerHandle!==null&&(this.clearTimeout(),this.deferred.reject(new M(P.CANCELLED,"Operation cancelled"+(e?": "+e:""))))}handleDelayElapsed(){this.asyncQueue.enqueueAndForget(()=>this.timerHandle!==null?(this.clearTimeout(),this.op().then(e=>this.deferred.resolve(e))):Promise.resolve())}clearTimeout(){this.timerHandle!==null&&(this.removalCallback(this),clearTimeout(this.timerHandle),this.timerHandle=null)}};var xl=class{constructor(){this.queries=mm(),this.onlineState="Unknown",this.ia=new Set}terminate(){(function(t,r){let i=ne(t),s=i.queries;i.queries=mm(),s.forEach((a,c)=>{for(let u of c.ta)u.onError(r)})})(this,new M(P.ABORTED,"Firestore shutting down"))}};function mm(){return new lt(n=>Jm(n),Ym)}function Ib(n){n.ia.forEach(e=>{e.next()})}var gm,_m;(_m=gm||(gm={}))._a="default",_m.Cache="cache";var Tb="SyncEngine";var Vl=class{constructor(e,t,r,i,s,a){this.localStore=e,this.remoteStore=t,this.eventManager=r,this.sharedClientState=i,this.currentUser=s,this.maxConcurrentLimboResolutions=a,this.La={},this.ka=new lt(c=>Jm(c),Ym),this.qa=new Map,this.Qa=new Set,this.$a=new Fe(V.comparator),this.Ka=new Map,this.Ua=new xi,this.Wa={},this.Ga=new Map,this.za=gr.Un(),this.onlineState="Unknown",this.ja=void 0}get isPrimaryClient(){return this.ja===!0}};function ym(n,e,t){let r=ne(n);if(r.isPrimaryClient&&t===0||!r.isPrimaryClient&&t===1){let i=[];r.ka.forEach((s,a)=>{let c=a.view.sa(e);c.snapshot&&i.push(c.snapshot)}),function(a,c){let u=ne(a);u.onlineState=c;let d=!1;u.queries.forEach((f,g)=>{for(let b of g.ta)b.sa(c)&&(d=!0)}),d&&Ib(u)}(r.eventManager,e),i.length&&r.La.p_(i),r.onlineState=e,r.isPrimaryClient&&r.sharedClientState.setOnlineState(e)}}async function Eb(n,e){let t=ne(n),r=e.batch.batchId;try{let i=await ub(t.localStore,e);Cg(t,r,null),kg(t,r),t.sharedClientState.updateMutationState(r,"acknowledged"),await eh(t,i)}catch(i){await ea(i)}}async function bb(n,e,t){let r=ne(n);try{let i=await function(a,c){let u=ne(a);return u.persistence.runTransaction("Reject batch","readwrite-primary",d=>{let f;return u.mutationQueue.lookupMutationBatch(d,c).next(g=>(U(g!==null),f=g.keys(),u.mutationQueue.removeMutationBatch(d,g))).next(()=>u.mutationQueue.performConsistencyCheck(d)).next(()=>u.documentOverlayCache.removeOverlaysForBatchId(d,f,c)).next(()=>u.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(d,f)).next(()=>u.localDocuments.getDocuments(d,f))})}(r.localStore,e);Cg(r,e,t),kg(r,e),r.sharedClientState.updateMutationState(e,"rejected",t),await eh(r,i)}catch(i){await ea(i)}}function kg(n,e){(n.Ga.get(e)||[]).forEach(t=>{t.resolve()}),n.Ga.delete(e)}function Cg(n,e,t){let r=ne(n),i=r.Wa[r.currentUser.toKey()];if(i){let s=i.get(e);s&&(t?s.reject(t):s.resolve(),i=i.remove(e)),r.Wa[r.currentUser.toKey()]=i}}async function eh(n,e,t){let r=ne(n),i=[],s=[],a=[];r.ka.isEmpty()||(r.ka.forEach((c,u)=>{a.push(r.Ha(u,e,t).then(d=>{var f;if((d||t)&&r.isPrimaryClient){let g=d?!d.fromCache:(f=t?.targetChanges.get(u.targetId))===null||f===void 0?void 0:f.current;r.sharedClientState.updateQueryState(u.targetId,g?"current":"not-current")}if(d){i.push(d);let g=wl.Yi(u.targetId,d);s.push(g)}}))}),await Promise.all(a),r.La.p_(i),await async function(u,d){let f=ne(u);try{await f.persistence.runTransaction("notifyLocalViewChanges","readwrite",g=>A.forEach(d,b=>A.forEach(b.Hi,R=>f.persistence.referenceDelegate.addReference(g,b.targetId,R)).next(()=>A.forEach(b.Ji,R=>f.persistence.referenceDelegate.removeReference(g,b.targetId,R)))))}catch(g){if(!yr(g))throw g;D(ab,"Failed to update sequence numbers: "+g)}for(let g of d){let b=g.targetId;if(!g.fromCache){let R=f.Ts.get(b),k=R.snapshotVersion,O=R.withLastLimboFreeSnapshotVersion(k);f.Ts=f.Ts.insert(b,O)}}}(r.localStore,s))}async function Ab(n,e){let t=ne(n);if(!t.currentUser.isEqual(e)){D(Tb,"User change. New user:",e.toKey());let r=await cb(t.localStore,e);t.currentUser=e,function(s,a){s.Ga.forEach(c=>{c.forEach(u=>{u.reject(new M(P.CANCELLED,a))})}),s.Ga.clear()}(t,"'waitForPendingWrites' promise is rejected due to a user change."),t.sharedClientState.handleUserChange(e,r.removedBatchIds,r.addedBatchIds),await eh(t,r.Rs)}}function Sb(n){let e=ne(n);return e.remoteStore.remoteSyncer.applySuccessfulWrite=Eb.bind(null,e),e.remoteStore.remoteSyncer.rejectFailedWrite=bb.bind(null,e),e}var Vi=class{constructor(){this.kind="memory",this.synchronizeTabs=!1}async initialize(e){this.serializer=bg(e.databaseInfo.databaseId),this.sharedClientState=this.Za(e),this.persistence=this.Xa(e),await this.persistence.start(),this.localStore=this.eu(e),this.gcScheduler=this.tu(e,this.localStore),this.indexBackfillerScheduler=this.nu(e,this.localStore)}tu(e,t){return null}nu(e,t){return null}eu(e){return Eg(this.persistence,new Go,e.initialUser,this.serializer)}Xa(e){return new $o(Ko.ri,this.serializer)}Za(e){return new Wo}async terminate(){var e,t;(e=this.gcScheduler)===null||e===void 0||e.stop(),(t=this.indexBackfillerScheduler)===null||t===void 0||t.stop(),this.sharedClientState.shutdown(),await this.persistence.shutdown()}};Vi.provider={build:()=>new Vi};var Ll=class extends Vi{constructor(e,t,r){super(),this.ru=e,this.cacheSizeBytes=t,this.forceOwnership=r,this.kind="persistent",this.synchronizeTabs=!1}async initialize(e){await super.initialize(e),await this.ru.initialize(this,e),await Sb(this.ru.syncEngine),await la(this.ru.remoteStore),await this.persistence.Ci(()=>(this.gcScheduler&&!this.gcScheduler.started&&this.gcScheduler.start(),this.indexBackfillerScheduler&&!this.indexBackfillerScheduler.started&&this.indexBackfillerScheduler.start(),Promise.resolve()))}eu(e){return Eg(this.persistence,new Go,e.initialUser,this.serializer)}tu(e,t){let r=this.persistence.referenceDelegate.garbageCollector;return new rl(r,e.asyncQueue,t)}nu(e,t){let r=new wu(t,this.persistence);return new yu(e.asyncQueue,r)}Xa(e){let t=ob(e.databaseInfo.databaseId,e.databaseInfo.persistenceKey),r=this.cacheSizeBytes!==void 0?qe.withCacheSize(this.cacheSizeBytes):qe.DEFAULT;return new yl(this.synchronizeTabs,t,e.clientId,r,e.asyncQueue,fb(),po(),this.serializer,this.sharedClientState,!!this.forceOwnership)}Za(e){return new Wo}};var Li=class{async initialize(e,t){this.localStore||(this.localStore=e.localStore,this.sharedClientState=e.sharedClientState,this.datastore=this.createDatastore(t),this.remoteStore=this.createRemoteStore(t),this.eventManager=this.createEventManager(t),this.syncEngine=this.createSyncEngine(t,!e.synchronizeTabs),this.sharedClientState.onlineStateHandler=r=>ym(this.syncEngine,r,1),this.remoteStore.remoteSyncer.handleCredentialChange=Ab.bind(null,this.syncEngine),await vb(this.remoteStore,this.syncEngine.isPrimaryClient))}createEventManager(e){return function(){return new xl}()}createDatastore(e){let t=bg(e.databaseInfo.databaseId),r=function(s){return new Sl(s)}(e.databaseInfo);return function(s,a,c,u){return new Cl(s,a,c,u)}(e.authCredentials,e.appCheckCredentials,r,t)}createRemoteStore(e){return function(r,i,s,a,c){return new Nl(r,i,s,a,c)}(this.localStore,this.datastore,e.asyncQueue,t=>ym(this.syncEngine,t,0),function(){return Qo.D()?new Qo:new Tl}())}createSyncEngine(e,t){return function(i,s,a,c,u,d,f){let g=new Vl(i,s,a,c,u,d);return f&&(g.ja=!0),g}(this.localStore,this.remoteStore,this.eventManager,this.sharedClientState,e.initialUser,e.maxConcurrentLimboResolutions,t)}async terminate(){var e,t;await async function(i){let s=ne(i);D(aa,"RemoteStore shutting down."),s.W_.add(5),await ca(s),s.z_.shutdown(),s.j_.set("Unknown")}(this.remoteStore),(e=this.datastore)===null||e===void 0||e.terminate(),(t=this.eventManager)===null||t===void 0||t.terminate()}};Li.provider={build:()=>new Li};function Rb(n){let e={};return n.timeoutSeconds!==void 0&&(e.timeoutSeconds=n.timeoutSeconds),e}var wm=new Map;function Pb(n,e,t,r){if(e===!0&&r===!0)throw new M(P.INVALID_ARGUMENT,`${n} and ${t} cannot be used together.`)}function kb(n){if(n===void 0)return"undefined";if(n===null)return"null";if(typeof n=="string")return n.length>20&&(n=`${n.substring(0,20)}...`),JSON.stringify(n);if(typeof n=="number"||typeof n=="boolean")return""+n;if(typeof n=="object"){if(n instanceof Array)return"an array";{let e=function(r){return r.constructor?r.constructor.name:null}(n);return e?`a custom ${e} object`:"an object"}}return typeof n=="function"?"a function":F()}function Cb(n,e){if("_delegate"in n&&(n=n._delegate),!(n instanceof e)){if(e.name===n.constructor.name)throw new M(P.INVALID_ARGUMENT,"Type does not match the expected instance. Did you pass a reference from a different Firestore SDK?");{let t=kb(n);throw new M(P.INVALID_ARGUMENT,`Expected type '${e.name}', but it was: ${t}`)}}return n}var Dg="firestore.googleapis.com",vm=!0,Jo=class{constructor(e){var t,r;if(e.host===void 0){if(e.ssl!==void 0)throw new M(P.INVALID_ARGUMENT,"Can't provide ssl option if host option is not set");this.host=Dg,this.ssl=vm}else this.host=e.host,this.ssl=(t=e.ssl)!==null&&t!==void 0?t:vm;if(this.credentials=e.credentials,this.ignoreUndefinedProperties=!!e.ignoreUndefinedProperties,this.localCache=e.localCache,e.cacheSizeBytes===void 0)this.cacheSizeBytes=_g;else{if(e.cacheSizeBytes!==-1&&e.cacheSizeBytes<Ig)throw new M(P.INVALID_ARGUMENT,"cacheSizeBytes must be at least 1048576");this.cacheSizeBytes=e.cacheSizeBytes}Pb("experimentalForceLongPolling",e.experimentalForceLongPolling,"experimentalAutoDetectLongPolling",e.experimentalAutoDetectLongPolling),this.experimentalForceLongPolling=!!e.experimentalForceLongPolling,this.experimentalForceLongPolling?this.experimentalAutoDetectLongPolling=!1:e.experimentalAutoDetectLongPolling===void 0?this.experimentalAutoDetectLongPolling=!0:this.experimentalAutoDetectLongPolling=!!e.experimentalAutoDetectLongPolling,this.experimentalLongPollingOptions=Rb((r=e.experimentalLongPollingOptions)!==null&&r!==void 0?r:{}),function(s){if(s.timeoutSeconds!==void 0){if(isNaN(s.timeoutSeconds))throw new M(P.INVALID_ARGUMENT,`invalid long polling timeout: ${s.timeoutSeconds} (must not be NaN)`);if(s.timeoutSeconds<5)throw new M(P.INVALID_ARGUMENT,`invalid long polling timeout: ${s.timeoutSeconds} (minimum allowed value is 5)`);if(s.timeoutSeconds>30)throw new M(P.INVALID_ARGUMENT,`invalid long polling timeout: ${s.timeoutSeconds} (maximum allowed value is 30)`)}}(this.experimentalLongPollingOptions),this.useFetchStreams=!!e.useFetchStreams}isEqual(e){return this.host===e.host&&this.ssl===e.ssl&&this.credentials===e.credentials&&this.cacheSizeBytes===e.cacheSizeBytes&&this.experimentalForceLongPolling===e.experimentalForceLongPolling&&this.experimentalAutoDetectLongPolling===e.experimentalAutoDetectLongPolling&&function(r,i){return r.timeoutSeconds===i.timeoutSeconds}(this.experimentalLongPollingOptions,e.experimentalLongPollingOptions)&&this.ignoreUndefinedProperties===e.ignoreUndefinedProperties&&this.useFetchStreams===e.useFetchStreams}},Xo=class{constructor(e,t,r,i){this._authCredentials=e,this._appCheckCredentials=t,this._databaseId=r,this._app=i,this.type="firestore-lite",this._persistenceKey="(lite)",this._settings=new Jo({}),this._settingsFrozen=!1,this._terminateTask="notTerminated"}get app(){if(!this._app)throw new M(P.FAILED_PRECONDITION,"Firestore was not initialized using the Firebase SDK. 'app' is not available");return this._app}get _initialized(){return this._settingsFrozen}get _terminated(){return this._terminateTask!=="notTerminated"}_setSettings(e){if(this._settingsFrozen)throw new M(P.FAILED_PRECONDITION,"Firestore has already been started and its settings can no longer be changed. You can only modify settings before calling any other methods on a Firestore object.");this._settings=new Jo(e),e.credentials!==void 0&&(this._authCredentials=function(r){if(!r)return new uu;switch(r.type){case"firstParty":return new fu(r.sessionIndex||"0",r.iamToken||null,r.authTokenFactory||null);case"provider":return r.client;default:throw new M(P.INVALID_ARGUMENT,"makeAuthCredentialsProvider failed due to invalid credential type")}}(e.credentials))}_getSettings(){return this._settings}_freezeSettings(){return this._settingsFrozen=!0,this._settings}_delete(){return this._terminateTask==="notTerminated"&&(this._terminateTask=this._terminate()),this._terminateTask}async _restart(){this._terminateTask==="notTerminated"?await this._terminate():this._terminateTask="notTerminated"}toJSON(){return{app:this._app,databaseId:this._databaseId,settings:this._settings}}_terminate(){return function(t){let r=wm.get(t);r&&(D("ComponentProvider","Removing Datastore"),wm.delete(t),r.terminate())}(this),Promise.resolve()}};function Db(n,e,t,r={}){var i;let s=(n=Cb(n,Xo))._getSettings(),a=`${e}:${t}`;if(s.host!==Dg&&s.host!==a&&Bl("Host has been set in both settings() and connectFirestoreEmulator(), emulator host will be used."),n._setSettings(Object.assign(Object.assign({},s),{host:a,ssl:!1})),r.mockUserToken){let c,u;if(typeof r.mockUserToken=="string")c=r.mockUserToken,u=ge.MOCK_USER;else{c=us(r.mockUserToken,(i=n._app)===null||i===void 0?void 0:i.options.projectId);let d=r.mockUserToken.sub||r.mockUserToken.user_id;if(!d)throw new M(P.INVALID_ARGUMENT,"mockUserToken must contain 'sub' or 'user_id' field!");u=new ge(d)}n._authCredentials=new lu(new mo(c,u))}}var Im="AsyncQueue",Zo=class{constructor(e=Promise.resolve()){this.Vu=[],this.mu=!1,this.fu=[],this.gu=null,this.pu=!1,this.yu=!1,this.wu=[],this.a_=new Yo(this,"async_queue_retry"),this.Su=()=>{let r=po();r&&D(Im,"Visibility state changed to "+r.visibilityState),this.a_.t_()},this.bu=e;let t=po();t&&typeof t.addEventListener=="function"&&t.addEventListener("visibilitychange",this.Su)}get isShuttingDown(){return this.mu}enqueueAndForget(e){this.enqueue(e)}enqueueAndForgetEvenWhileRestricted(e){this.Du(),this.vu(e)}enterRestrictedMode(e){if(!this.mu){this.mu=!0,this.yu=e||!1;let t=po();t&&typeof t.removeEventListener=="function"&&t.removeEventListener("visibilitychange",this.Su)}}enqueue(e){if(this.Du(),this.mu)return new Promise(()=>{});let t=new qt;return this.vu(()=>this.mu&&this.yu?Promise.resolve():(e().then(t.resolve,t.reject),t.promise)).then(()=>t.promise)}enqueueRetryable(e){this.enqueueAndForget(()=>(this.Vu.push(e),this.Cu()))}async Cu(){if(this.Vu.length!==0){try{await this.Vu[0](),this.Vu.shift(),this.a_.reset()}catch(e){if(!yr(e))throw e;D(Im,"Operation failed with retryable error: "+e)}this.Vu.length>0&&this.a_.Xo(()=>this.Cu())}}vu(e){let t=this.bu.then(()=>(this.pu=!0,e().catch(r=>{this.gu=r,this.pu=!1;let i=function(a){let c=a.message||"";return a.stack&&(c=a.stack.includes(a.message)?a.stack:a.message+`
`+a.stack),c}(r);throw je("INTERNAL UNHANDLED ERROR: ",i),r}).then(r=>(this.pu=!1,r))));return this.bu=t,t}enqueueAfterDelay(e,t,r){this.Du(),this.wu.indexOf(e)>-1&&(t=0);let i=Ol.createAndSchedule(this,e,t,r,s=>this.Fu(s));return this.fu.push(i),i}Du(){this.gu&&F()}verifyOperationInProgress(){}async Mu(){let e;do e=this.bu,await e;while(e!==this.bu)}xu(e){for(let t of this.fu)if(t.timerId===e)return!0;return!1}Ou(e){return this.Mu().then(()=>{this.fu.sort((t,r)=>t.targetTimeMs-r.targetTimeMs);for(let t of this.fu)if(t.skipDelay(),e!=="all"&&t.timerId===e)break;return this.Mu()})}Nu(e){this.wu.push(e)}Fu(e){let t=this.fu.indexOf(e);this.fu.splice(t,1)}};var Ml=class extends Xo{constructor(e,t,r,i){super(e,t,r,i),this.type="firestore",this._queue=new Zo,this._persistenceKey=i?.name||"[DEFAULT]"}async _terminate(){if(this._firestoreClient){let e=this._firestoreClient.terminate();this._queue=new Zo(e),this._firestoreClient=void 0,await e}}};function Ng(n,e,t){t||(t=Si);let r=pe(n,"firestore");if(r.isInitialized(t)){let i=r.getImmediate({identifier:t}),s=r.getOptions(t);if(Xe(s,e))return i;throw new M(P.FAILED_PRECONDITION,"initializeFirestore() has already been called with different options. To avoid this error, call initializeFirestore() with the same options as when it was originally called, or call getFirestore() to return the already initialized instance.")}if(e.cacheSizeBytes!==void 0&&e.localCache!==void 0)throw new M(P.INVALID_ARGUMENT,"cache and cacheSizeBytes cannot be specified at the same time as cacheSizeBytes willbe deprecated. Instead, specify the cache size in the cache object");if(e.cacheSizeBytes!==void 0&&e.cacheSizeBytes!==-1&&e.cacheSizeBytes<Ig)throw new M(P.INVALID_ARGUMENT,"cacheSizeBytes must be at least 1048576");return r.initialize({options:e,instanceIdentifier:t})}function Og(n,e){let t=typeof n=="object"?n:Ve(),r=typeof n=="string"?n:e||Si,i=pe(t,"firestore").getImmediate({identifier:r});if(!i._initialized){let s=cs("firestore");s&&Db(i,...s)}return i}var MR=new RegExp("[~\\*/\\[\\]]");var Fl=class{constructor(e){let t;this.kind="persistent",e?.tabManager?(e.tabManager._initialize(e),t=e.tabManager):(t=th(void 0),t._initialize(e)),this._onlineComponentProvider=t._onlineComponentProvider,this._offlineComponentProvider=t._offlineComponentProvider}toJSON(){return{kind:this.kind}}};function xg(n){return new Fl(n)}var Ul=class{constructor(e){this.forceOwnership=e,this.kind="persistentSingleTab"}toJSON(){return{kind:this.kind}}_initialize(e){this._onlineComponentProvider=Li.provider,this._offlineComponentProvider={build:t=>new Ll(t,e?.cacheSizeBytes,this.forceOwnership)}}};function th(n){return new Ul(n?.forceOwnership)}(function(e,t=!0){(function(i){_r=i})(tt),oe(new te("firestore",(r,{instanceIdentifier:i,options:s})=>{let a=r.getProvider("app").getImmediate(),c=new Ml(new hu(r.getProvider("auth-internal")),new pu(a,r.getProvider("app-check-internal")),function(d,f){if(!Object.prototype.hasOwnProperty.apply(d.options,["projectId"]))throw new M(P.INVALID_ARGUMENT,'"projectId" not provided in firebase.initializeApp.');return new Ri(d.options.projectId,f)}(a,i),a);return s=Object.assign({useFetchStreams:t},s),c._setSettings(s),c},"PUBLIC").setMultipleInstances(!0)),re(Tp,Ep,e),re(Tp,Ep,"esm2017")})();var ha="analytics",Nb="firebase_id",Ob="origin",xb=60*1e3,Vb="https://firebase.googleapis.com/v1alpha/projects/-/apps/{app-id}/webConfig",ch="https://www.googletagmanager.com/gtag/js";var Oe=new Ze("@firebase/analytics");var Lb={"already-exists":"A Firebase Analytics instance with the appId {$id}  already exists. Only one Firebase Analytics instance can be created for each appId.","already-initialized":"initializeAnalytics() cannot be called again with different options than those it was initially called with. It can be called again with the same options to return the existing instance, or getAnalytics() can be used to get a reference to the already-initialized instance.","already-initialized-settings":"Firebase Analytics has already been initialized.settings() must be called before initializing any Analytics instanceor it will have no effect.","interop-component-reg-failed":"Firebase Analytics Interop Component failed to instantiate: {$reason}","invalid-analytics-context":"Firebase Analytics is not supported in this environment. Wrap initialization of analytics in analytics.isSupported() to prevent initialization in unsupported environments. Details: {$errorInfo}","indexeddb-unavailable":"IndexedDB unavailable or restricted in this environment. Wrap initialization of analytics in analytics.isSupported() to prevent initialization in unsupported environments. Details: {$errorInfo}","fetch-throttle":"The config fetch request timed out while in an exponential backoff state. Unix timestamp in milliseconds when fetch request throttling ends: {$throttleEndTimeMillis}.","config-fetch-failed":"Dynamic config fetch failed: [{$httpStatus}] {$responseMessage}","no-api-key":'The "apiKey" field is empty in the local Firebase config. Firebase Analytics requires this field tocontain a valid API key.',"no-app-id":'The "appId" field is empty in the local Firebase config. Firebase Analytics requires this field tocontain a valid app ID.',"no-client-id":'The "client_id" field is empty.',"invalid-gtag-resource":"Trusted Types detected an invalid gtag resource: {$gtagURL}."},Ue=new ye("analytics","Analytics",Lb);function Mb(n){if(!n.startsWith(ch)){let e=Ue.create("invalid-gtag-resource",{gtagURL:n});return Oe.warn(e.message),""}return n}function qg(n){return Promise.all(n.map(e=>e.catch(t=>t)))}function Fb(n,e){let t;return window.trustedTypes&&(t=window.trustedTypes.createPolicy(n,e)),t}function Ub(n,e){let t=Fb("firebase-js-sdk-policy",{createScriptURL:Mb}),r=document.createElement("script"),i=`${ch}?l=${n}&id=${e}`;r.src=t?t?.createScriptURL(i):i,r.async=!0,document.head.appendChild(r)}function Bb(n){let e=[];return Array.isArray(window[n])?e=window[n]:window[n]=e,e}async function qb(n,e,t,r,i,s){let a=r[i];try{if(a)await e[a];else{let u=(await qg(t)).find(d=>d.measurementId===i);u&&await e[u.appId]}}catch(c){Oe.error(c)}n("config",i,s)}async function jb(n,e,t,r,i){try{let s=[];if(i&&i.send_to){let a=i.send_to;Array.isArray(a)||(a=[a]);let c=await qg(t);for(let u of a){let d=c.find(g=>g.measurementId===u),f=d&&e[d.appId];if(f)s.push(f);else{s=[];break}}}s.length===0&&(s=Object.values(e)),await Promise.all(s),n("event",r,i||{})}catch(s){Oe.error(s)}}function zb(n,e,t,r){async function i(s,...a){try{if(s==="event"){let[c,u]=a;await jb(n,e,t,c,u)}else if(s==="config"){let[c,u]=a;await qb(n,e,t,r,c,u)}else if(s==="consent"){let[c,u]=a;n("consent",c,u)}else if(s==="get"){let[c,u,d]=a;n("get",c,u,d)}else if(s==="set"){let[c]=a;n("set",c)}else n(s,...a)}catch(c){Oe.error(c)}}return i}function $b(n,e,t,r,i){let s=function(...a){window[r].push(arguments)};return window[i]&&typeof window[i]=="function"&&(s=window[i]),window[i]=zb(s,n,e,t),{gtagCore:s,wrappedGtag:window[i]}}function Kb(n){let e=window.document.getElementsByTagName("script");for(let t of Object.values(e))if(t.src&&t.src.includes(ch)&&t.src.includes(n))return t;return null}var Gb=30,Hb=1e3,rh=class{constructor(e={},t=Hb){this.throttleMetadata=e,this.intervalMillis=t}getThrottleMetadata(e){return this.throttleMetadata[e]}setThrottleMetadata(e,t){this.throttleMetadata[e]=t}deleteThrottleMetadata(e){delete this.throttleMetadata[e]}},jg=new rh;function Wb(n){return new Headers({Accept:"application/json","x-goog-api-key":n})}async function Qb(n){var e;let{appId:t,apiKey:r}=n,i={method:"GET",headers:Wb(r)},s=Vb.replace("{app-id}",t),a=await fetch(s,i);if(a.status!==200&&a.status!==304){let c="";try{let u=await a.json();!((e=u.error)===null||e===void 0)&&e.message&&(c=u.error.message)}catch{}throw Ue.create("config-fetch-failed",{httpStatus:a.status,responseMessage:c})}return a.json()}async function Yb(n,e=jg,t){let{appId:r,apiKey:i,measurementId:s}=n.options;if(!r)throw Ue.create("no-app-id");if(!i){if(s)return{measurementId:s,appId:r};throw Ue.create("no-api-key")}let a=e.getThrottleMetadata(r)||{backoffCount:0,throttleEndTimeMillis:Date.now()},c=new ih;return setTimeout(async()=>{c.abort()},t!==void 0?t:xb),zg({appId:r,apiKey:i,measurementId:s},a,c,e)}async function zg(n,{throttleEndTimeMillis:e,backoffCount:t},r,i=jg){var s;let{appId:a,measurementId:c}=n;try{await Jb(r,e)}catch(u){if(c)return Oe.warn(`Timed out fetching this Firebase app's measurement ID from the server. Falling back to the measurement ID ${c} provided in the "measurementId" field in the local Firebase config. [${u?.message}]`),{appId:a,measurementId:c};throw u}try{let u=await Qb(n);return i.deleteThrottleMetadata(a),u}catch(u){let d=u;if(!Xb(d)){if(i.deleteThrottleMetadata(a),c)return Oe.warn(`Failed to fetch this Firebase app's measurement ID from the server. Falling back to the measurement ID ${c} provided in the "measurementId" field in the local Firebase config. [${d?.message}]`),{appId:a,measurementId:c};throw u}let f=Number((s=d?.customData)===null||s===void 0?void 0:s.httpStatus)===503?Ka(t,i.intervalMillis,Gb):Ka(t,i.intervalMillis),g={throttleEndTimeMillis:Date.now()+f,backoffCount:t+1};return i.setThrottleMetadata(a,g),Oe.debug(`Calling attemptFetch again in ${f} millis`),zg(n,g,r,i)}}function Jb(n,e){return new Promise((t,r)=>{let i=Math.max(e-Date.now(),0),s=setTimeout(t,i);n.addEventListener(()=>{clearTimeout(s),r(Ue.create("fetch-throttle",{throttleEndTimeMillis:e}))})})}function Xb(n){if(!(n instanceof he)||!n.customData)return!1;let e=Number(n.customData.httpStatus);return e===429||e===500||e===503||e===504}var ih=class{constructor(){this.listeners=[]}addEventListener(e){this.listeners.push(e)}abort(){this.listeners.forEach(e=>e())}};var sh;async function Zb(n,e,t,r,i){if(i&&i.global){n("event",t,r);return}else{let s=await e,a=Object.assign(Object.assign({},r),{send_to:s});n("event",t,a)}}var oh;function eA(n){oh=n}function tA(n){sh=n}async function nA(){if(Ge())try{await _t()}catch(n){return Oe.warn(Ue.create("indexeddb-unavailable",{errorInfo:n?.toString()}).message),!1}else return Oe.warn(Ue.create("indexeddb-unavailable",{errorInfo:"IndexedDB is not available in this environment."}).message),!1;return!0}async function rA(n,e,t,r,i,s,a){var c;let u=Yb(n);u.then(R=>{t[R.measurementId]=R.appId,n.options.measurementId&&R.measurementId!==n.options.measurementId&&Oe.warn(`The measurement ID in the local Firebase config (${n.options.measurementId}) does not match the measurement ID fetched from the server (${R.measurementId}). To ensure analytics events are always sent to the correct Analytics property, update the measurement ID field in the local config or remove it from the local config.`)}).catch(R=>Oe.error(R)),e.push(u);let d=nA().then(R=>{if(R)return r.getId()}),[f,g]=await Promise.all([u,d]);Kb(s)||Ub(s,f.measurementId),oh&&(i("consent","default",oh),eA(void 0)),i("js",new Date);let b=(c=a?.config)!==null&&c!==void 0?c:{};return b[Ob]="firebase",b.update=!0,g!=null&&(b[Nb]=g),i("config",f.measurementId,b),sh&&(i("set",sh),tA(void 0)),f.measurementId}var ah=class{constructor(e){this.app=e}_delete(){return delete Ui[this.app.options.appId],Promise.resolve()}},Ui={},Vg=[],Lg={},nh="dataLayer",iA="gtag",Mg,$g,Fg=!1;function sA(){let n=[];if(Br()&&n.push("This is a browser extension environment."),qr()||n.push("Cookies are not available."),n.length>0){let e=n.map((r,i)=>`(${i+1}) ${r}`).join(" "),t=Ue.create("invalid-analytics-context",{errorInfo:e});Oe.warn(t.message)}}function oA(n,e,t){sA();let r=n.options.appId;if(!r)throw Ue.create("no-app-id");if(!n.options.apiKey)if(n.options.measurementId)Oe.warn(`The "apiKey" field is empty in the local Firebase config. This is needed to fetch the latest measurement ID for this Firebase app. Falling back to the measurement ID ${n.options.measurementId} provided in the "measurementId" field in the local Firebase config.`);else throw Ue.create("no-api-key");if(Ui[r]!=null)throw Ue.create("already-exists",{id:r});if(!Fg){Bb(nh);let{wrappedGtag:s,gtagCore:a}=$b(Ui,Vg,Lg,nh,iA);$g=s,Mg=a,Fg=!0}return Ui[r]=rA(n,Vg,Lg,e,Mg,nh,t),new ah(n)}function Kg(n=Ve()){n=de(n);let e=pe(n,ha);return e.isInitialized()?e.getImmediate():aA(n)}function aA(n,e={}){let t=pe(n,ha);if(t.isInitialized()){let i=t.getImmediate();if(Xe(e,t.getOptions()))return i;throw Ue.create("already-initialized")}return t.initialize({options:e})}async function Gg(){if(Br()||!qr()||!Ge())return!1;try{return await _t()}catch{return!1}}function cA(n,e,t,r){n=de(n),Zb($g,Ui[n.app.options.appId],e,t,r).catch(i=>Oe.error(i))}var Ug="@firebase/analytics",Bg="0.10.11";function uA(){oe(new te(ha,(e,{options:t})=>{let r=e.getProvider("app").getImmediate(),i=e.getProvider("installations-internal").getImmediate();return oA(r,i,t)},"PUBLIC")),oe(new te("analytics-internal",n,"PRIVATE")),re(Ug,Bg),re(Ug,Bg,"esm2017");function n(e){try{let t=e.getProvider(ha).getImmediate();return{logEvent:(r,i,s)=>cA(t,r,i,s)}}catch(t){throw Ue.create("interop-component-reg-failed",{reason:t})}}}uA();var lA="/firebase-messaging-sw.js",hA="/firebase-cloud-messaging-push-scope",e_="BDOU99-h67HcA6JeFXHbSNMu7e2yNNu3RzoMj8TM4W88jITfq7ZmPvIM1Iv-4_l2LxQcYwhqby2xGpWwzjfAnG4",dA="https://fcmregistrations.googleapis.com/v1",t_="google.c.a.c_id",fA="google.c.a.c_l",pA="google.c.a.ts",mA="google.c.a.e",Hg=1e4,Wg;(function(n){n[n.DATA_MESSAGE=1]="DATA_MESSAGE",n[n.DISPLAY_NOTIFICATION=3]="DISPLAY_NOTIFICATION"})(Wg||(Wg={}));var Bi;(function(n){n.PUSH_RECEIVED="push-received",n.NOTIFICATION_CLICKED="notification-clicked"})(Bi||(Bi={}));function St(n){let e=new Uint8Array(n);return btoa(String.fromCharCode(...e)).replace(/=/g,"").replace(/\+/g,"-").replace(/\//g,"_")}function gA(n){let e="=".repeat((4-n.length%4)%4),t=(n+e).replace(/\-/g,"+").replace(/_/g,"/"),r=atob(t),i=new Uint8Array(r.length);for(let s=0;s<r.length;++s)i[s]=r.charCodeAt(s);return i}var uh="fcm_token_details_db",_A=5,Qg="fcm_token_object_Store";async function yA(n){if("databases"in indexedDB&&!(await indexedDB.databases()).map(s=>s.name).includes(uh))return null;let e=null;return(await et(uh,_A,{upgrade:async(r,i,s,a)=>{var c;if(i<2||!r.objectStoreNames.contains(Qg))return;let u=a.objectStore(Qg),d=await u.index("fcmSenderId").get(n);if(await u.clear(),!!d){if(i===2){let f=d;if(!f.auth||!f.p256dh||!f.endpoint)return;e={token:f.fcmToken,createTime:(c=f.createTime)!==null&&c!==void 0?c:Date.now(),subscriptionOptions:{auth:f.auth,p256dh:f.p256dh,endpoint:f.endpoint,swScope:f.swScope,vapidKey:typeof f.vapidKey=="string"?f.vapidKey:St(f.vapidKey)}}}else if(i===3){let f=d;e={token:f.fcmToken,createTime:f.createTime,subscriptionOptions:{auth:St(f.auth),p256dh:St(f.p256dh),endpoint:f.endpoint,swScope:f.swScope,vapidKey:St(f.vapidKey)}}}else if(i===4){let f=d;e={token:f.fcmToken,createTime:f.createTime,subscriptionOptions:{auth:St(f.auth),p256dh:St(f.p256dh),endpoint:f.endpoint,swScope:f.swScope,vapidKey:St(f.vapidKey)}}}}}})).close(),await Nt(uh),await Nt("fcm_vapid_details_db"),await Nt("undefined"),wA(e)?e:null}function wA(n){if(!n||!n.subscriptionOptions)return!1;let{subscriptionOptions:e}=n;return typeof n.createTime=="number"&&n.createTime>0&&typeof n.token=="string"&&n.token.length>0&&typeof e.auth=="string"&&e.auth.length>0&&typeof e.p256dh=="string"&&e.p256dh.length>0&&typeof e.endpoint=="string"&&e.endpoint.length>0&&typeof e.swScope=="string"&&e.swScope.length>0&&typeof e.vapidKey=="string"&&e.vapidKey.length>0}var vA="firebase-messaging-database",IA=1,qi="firebase-messaging-store",lh=null;function n_(){return lh||(lh=et(vA,IA,{upgrade:(n,e)=>{switch(e){case 0:n.createObjectStore(qi)}}})),lh}async function TA(n){let e=r_(n),r=await(await n_()).transaction(qi).objectStore(qi).get(e);if(r)return r;{let i=await yA(n.appConfig.senderId);if(i)return await fh(n,i),i}}async function fh(n,e){let t=r_(n),i=(await n_()).transaction(qi,"readwrite");return await i.objectStore(qi).put(e,t),await i.done,e}function r_({appConfig:n}){return n.appId}var EA={"missing-app-config-values":'Missing App configuration value: "{$valueName}"',"only-available-in-window":"This method is available in a Window context.","only-available-in-sw":"This method is available in a service worker context.","permission-default":"The notification permission was not granted and dismissed instead.","permission-blocked":"The notification permission was not granted and blocked instead.","unsupported-browser":"This browser doesn't support the API's required to use the Firebase SDK.","indexed-db-unsupported":"This browser doesn't support indexedDb.open() (ex. Safari iFrame, Firefox Private Browsing, etc)","failed-service-worker-registration":"We are unable to register the default service worker. {$browserErrorMessage}","token-subscribe-failed":"A problem occurred while subscribing the user to FCM: {$errorInfo}","token-subscribe-no-token":"FCM returned no token when subscribing the user to push.","token-unsubscribe-failed":"A problem occurred while unsubscribing the user from FCM: {$errorInfo}","token-update-failed":"A problem occurred while updating the user from FCM: {$errorInfo}","token-update-no-token":"FCM returned no token when updating the user to push.","use-sw-after-get-token":"The useServiceWorker() method may only be called once and must be called before calling getToken() to ensure your service worker is used.","invalid-sw-registration":"The input to useServiceWorker() must be a ServiceWorkerRegistration.","invalid-bg-handler":"The input to setBackgroundMessageHandler() must be a function.","invalid-vapid-key":"The public VAPID key must be a string.","use-vapid-key-after-get-token":"The usePublicVapidKey() method may only be called once and must be called before calling getToken() to ensure your VAPID key is used."},De=new ye("messaging","Messaging",EA);async function bA(n,e){let t=await mh(n),r=i_(e),i={method:"POST",headers:t,body:JSON.stringify(r)},s;try{s=await(await fetch(ph(n.appConfig),i)).json()}catch(a){throw De.create("token-subscribe-failed",{errorInfo:a?.toString()})}if(s.error){let a=s.error.message;throw De.create("token-subscribe-failed",{errorInfo:a})}if(!s.token)throw De.create("token-subscribe-no-token");return s.token}async function AA(n,e){let t=await mh(n),r=i_(e.subscriptionOptions),i={method:"PATCH",headers:t,body:JSON.stringify(r)},s;try{s=await(await fetch(`${ph(n.appConfig)}/${e.token}`,i)).json()}catch(a){throw De.create("token-update-failed",{errorInfo:a?.toString()})}if(s.error){let a=s.error.message;throw De.create("token-update-failed",{errorInfo:a})}if(!s.token)throw De.create("token-update-no-token");return s.token}async function SA(n,e){let r={method:"DELETE",headers:await mh(n)};try{let s=await(await fetch(`${ph(n.appConfig)}/${e}`,r)).json();if(s.error){let a=s.error.message;throw De.create("token-unsubscribe-failed",{errorInfo:a})}}catch(i){throw De.create("token-unsubscribe-failed",{errorInfo:i?.toString()})}}function ph({projectId:n}){return`${dA}/projects/${n}/registrations`}async function mh({appConfig:n,installations:e}){let t=await e.getToken();return new Headers({"Content-Type":"application/json",Accept:"application/json","x-goog-api-key":n.apiKey,"x-goog-firebase-installations-auth":`FIS ${t}`})}function i_({p256dh:n,auth:e,endpoint:t,vapidKey:r}){let i={web:{endpoint:t,auth:e,p256dh:n}};return r!==e_&&(i.web.applicationPubKey=r),i}var RA=7*24*60*60*1e3;async function PA(n){let e=await CA(n.swRegistration,n.vapidKey),t={vapidKey:n.vapidKey,swScope:n.swRegistration.scope,endpoint:e.endpoint,auth:St(e.getKey("auth")),p256dh:St(e.getKey("p256dh"))},r=await TA(n.firebaseDependencies);if(r){if(DA(r.subscriptionOptions,t))return Date.now()>=r.createTime+RA?kA(n,{token:r.token,createTime:Date.now(),subscriptionOptions:t}):r.token;try{await SA(n.firebaseDependencies,r.token)}catch(i){console.warn(i)}return Yg(n.firebaseDependencies,t)}else return Yg(n.firebaseDependencies,t)}async function kA(n,e){try{let t=await AA(n.firebaseDependencies,e),r=Object.assign(Object.assign({},e),{token:t,createTime:Date.now()});return await fh(n.firebaseDependencies,r),t}catch(t){throw t}}async function Yg(n,e){let r={token:await bA(n,e),createTime:Date.now(),subscriptionOptions:e};return await fh(n,r),r.token}async function CA(n,e){let t=await n.pushManager.getSubscription();return t||n.pushManager.subscribe({userVisibleOnly:!0,applicationServerKey:gA(e)})}function DA(n,e){let t=e.vapidKey===n.vapidKey,r=e.endpoint===n.endpoint,i=e.auth===n.auth,s=e.p256dh===n.p256dh;return t&&r&&i&&s}function Jg(n){let e={from:n.from,collapseKey:n.collapse_key,messageId:n.fcmMessageId};return NA(e,n),OA(e,n),xA(e,n),e}function NA(n,e){if(!e.notification)return;n.notification={};let t=e.notification.title;t&&(n.notification.title=t);let r=e.notification.body;r&&(n.notification.body=r);let i=e.notification.image;i&&(n.notification.image=i);let s=e.notification.icon;s&&(n.notification.icon=s)}function OA(n,e){e.data&&(n.data=e.data)}function xA(n,e){var t,r,i,s,a;if(!e.fcmOptions&&!(!((t=e.notification)===null||t===void 0)&&t.click_action))return;n.fcmOptions={};let c=(i=(r=e.fcmOptions)===null||r===void 0?void 0:r.link)!==null&&i!==void 0?i:(s=e.notification)===null||s===void 0?void 0:s.click_action;c&&(n.fcmOptions.link=c);let u=(a=e.fcmOptions)===null||a===void 0?void 0:a.analytics_label;u&&(n.fcmOptions.analyticsLabel=u)}function VA(n){return typeof n=="object"&&!!n&&t_ in n}LA("AzSCbw63g1R0nCw85jG8","Iaya3yLKwmgvh7cF0q4");function LA(n,e){let t=[];for(let r=0;r<n.length;r++)t.push(n.charAt(r)),r<e.length&&t.push(e.charAt(r));return t.join("")}function MA(n){if(!n||!n.options)throw hh("App Configuration Object");if(!n.name)throw hh("App Name");let e=["projectId","apiKey","appId","messagingSenderId"],{options:t}=n;for(let r of e)if(!t[r])throw hh(r);return{appName:n.name,projectId:t.projectId,apiKey:t.apiKey,appId:t.appId,senderId:t.messagingSenderId}}function hh(n){return De.create("missing-app-config-values",{valueName:n})}var dh=class{constructor(e,t,r){this.deliveryMetricsExportedToBigQueryEnabled=!1,this.onBackgroundMessageHandler=null,this.onMessageHandler=null,this.logEvents=[],this.isLogServiceStarted=!1;let i=MA(e);this.firebaseDependencies={app:e,appConfig:i,installations:t,analyticsProvider:r}}_delete(){return Promise.resolve()}};async function FA(n){try{n.swRegistration=await navigator.serviceWorker.register(lA,{scope:hA}),n.swRegistration.update().catch(()=>{}),await UA(n.swRegistration)}catch(e){throw De.create("failed-service-worker-registration",{browserErrorMessage:e?.message})}}async function UA(n){return new Promise((e,t)=>{let r=setTimeout(()=>t(new Error(`Service worker not registered after ${Hg} ms`)),Hg),i=n.installing||n.waiting;n.active?(clearTimeout(r),e()):i?i.onstatechange=s=>{var a;((a=s.target)===null||a===void 0?void 0:a.state)==="activated"&&(i.onstatechange=null,clearTimeout(r),e())}:(clearTimeout(r),t(new Error("No incoming service worker found.")))})}async function BA(n,e){if(!e&&!n.swRegistration&&await FA(n),!(!e&&n.swRegistration)){if(!(e instanceof ServiceWorkerRegistration))throw De.create("invalid-sw-registration");n.swRegistration=e}}async function qA(n,e){e?n.vapidKey=e:n.vapidKey||(n.vapidKey=e_)}async function jA(n,e){if(!navigator)throw De.create("only-available-in-window");if(Notification.permission==="default"&&await Notification.requestPermission(),Notification.permission!=="granted")throw De.create("permission-blocked");return await qA(n,e?.vapidKey),await BA(n,e?.serviceWorkerRegistration),PA(n)}async function zA(n,e,t){let r=$A(e);(await n.firebaseDependencies.analyticsProvider.get()).logEvent(r,{message_id:t[t_],message_name:t[fA],message_time:t[pA],message_device_time:Math.floor(Date.now()/1e3)})}function $A(n){switch(n){case Bi.NOTIFICATION_CLICKED:return"notification_open";case Bi.PUSH_RECEIVED:return"notification_foreground";default:throw new Error}}async function KA(n,e){let t=e.data;if(!t.isFirebaseMessaging)return;n.onMessageHandler&&t.messageType===Bi.PUSH_RECEIVED&&(typeof n.onMessageHandler=="function"?n.onMessageHandler(Jg(t)):n.onMessageHandler.next(Jg(t)));let r=t.data;VA(r)&&r[mA]==="1"&&await zA(n,t.messageType,r)}var Xg="@firebase/messaging",Zg="0.12.16";var GA=n=>{let e=new dh(n.getProvider("app").getImmediate(),n.getProvider("installations-internal").getImmediate(),n.getProvider("analytics-internal"));return navigator.serviceWorker.addEventListener("message",t=>KA(e,t)),e},HA=n=>{let e=n.getProvider("messaging").getImmediate();return{getToken:r=>jA(e,r)}};function WA(){oe(new te("messaging",GA,"PUBLIC")),oe(new te("messaging-internal",HA,"PRIVATE")),re(Xg,Zg),re(Xg,Zg,"esm2017")}async function gh(){try{await _t()}catch{return!1}return typeof window<"u"&&Ge()&&qr()&&"serviceWorker"in navigator&&"PushManager"in window&&"Notification"in window&&"fetch"in window&&ServiceWorkerRegistration.prototype.hasOwnProperty("showNotification")&&PushSubscription.prototype.hasOwnProperty("getKey")}function s_(n=Ve()){return gh().then(e=>{if(!e)throw De.create("unsupported-browser")},e=>{throw De.create("indexed-db-unsupported")}),pe(de(n),"messaging").getImmediate()}WA();var h_="firebasestorage.googleapis.com",QA="storageBucket",YA=2*60*1e3,JA=10*60*1e3;var ht=class n extends he{constructor(e,t,r=0){super(_h(e),`Firebase Storage: ${t} (${_h(e)})`),this.status_=r,this.customData={serverResponse:null},this._baseMessage=this.message,Object.setPrototypeOf(this,n.prototype)}get status(){return this.status_}set status(e){this.status_=e}_codeEquals(e){return _h(e)===this.code}get serverResponse(){return this.customData.serverResponse}set serverResponse(e){this.customData.serverResponse=e,this.customData.serverResponse?this.message=`${this._baseMessage}
${this.customData.serverResponse}`:this.message=this._baseMessage}},dt;(function(n){n.UNKNOWN="unknown",n.OBJECT_NOT_FOUND="object-not-found",n.BUCKET_NOT_FOUND="bucket-not-found",n.PROJECT_NOT_FOUND="project-not-found",n.QUOTA_EXCEEDED="quota-exceeded",n.UNAUTHENTICATED="unauthenticated",n.UNAUTHORIZED="unauthorized",n.UNAUTHORIZED_APP="unauthorized-app",n.RETRY_LIMIT_EXCEEDED="retry-limit-exceeded",n.INVALID_CHECKSUM="invalid-checksum",n.CANCELED="canceled",n.INVALID_EVENT_NAME="invalid-event-name",n.INVALID_URL="invalid-url",n.INVALID_DEFAULT_BUCKET="invalid-default-bucket",n.NO_DEFAULT_BUCKET="no-default-bucket",n.CANNOT_SLICE_BLOB="cannot-slice-blob",n.SERVER_FILE_WRONG_SIZE="server-file-wrong-size",n.NO_DOWNLOAD_URL="no-download-url",n.INVALID_ARGUMENT="invalid-argument",n.INVALID_ARGUMENT_COUNT="invalid-argument-count",n.APP_DELETED="app-deleted",n.INVALID_ROOT_OPERATION="invalid-root-operation",n.INVALID_FORMAT="invalid-format",n.INTERNAL_ERROR="internal-error",n.UNSUPPORTED_ENVIRONMENT="unsupported-environment"})(dt||(dt={}));function _h(n){return"storage/"+n}function XA(){let n="An unknown error occurred, please check the error payload for server response.";return new ht(dt.UNKNOWN,n)}function ZA(){return new ht(dt.RETRY_LIMIT_EXCEEDED,"Max retry time for operation exceeded, please try again.")}function eS(){return new ht(dt.CANCELED,"User canceled the upload/download.")}function tS(n){return new ht(dt.INVALID_URL,"Invalid URL '"+n+"'.")}function nS(n){return new ht(dt.INVALID_DEFAULT_BUCKET,"Invalid default bucket '"+n+"'.")}function o_(n){return new ht(dt.INVALID_ARGUMENT,n)}function d_(){return new ht(dt.APP_DELETED,"The Firebase app was deleted.")}function rS(n){return new ht(dt.INVALID_ROOT_OPERATION,"The operation '"+n+"' cannot be performed on a root reference, create a non-root reference using child, such as .child('file.png').")}var Rt=class n{constructor(e,t){this.bucket=e,this.path_=t}get path(){return this.path_}get isRoot(){return this.path.length===0}fullServerUrl(){let e=encodeURIComponent;return"/b/"+e(this.bucket)+"/o/"+e(this.path)}bucketOnlyServerUrl(){return"/b/"+encodeURIComponent(this.bucket)+"/o"}static makeFromBucketSpec(e,t){let r;try{r=n.makeFromUrl(e,t)}catch{return new n(e,"")}if(r.path==="")return r;throw nS(e)}static makeFromUrl(e,t){let r=null,i="([A-Za-z0-9.\\-_]+)";function s(B){B.path.charAt(B.path.length-1)==="/"&&(B.path_=B.path_.slice(0,-1))}let a="(/(.*))?$",c=new RegExp("^gs://"+i+a,"i"),u={bucket:1,path:3};function d(B){B.path_=decodeURIComponent(B.path)}let f="v[A-Za-z0-9_]+",g=t.replace(/[.]/g,"\\."),b="(/([^?#]*).*)?$",R=new RegExp(`^https?://${g}/${f}/b/${i}/o${b}`,"i"),k={bucket:1,path:3},O=t===h_?"(?:storage.googleapis.com|storage.cloud.google.com)":t,N="([^?#]*)",Y=new RegExp(`^https?://${O}/${i}/${N}`,"i"),L=[{regex:c,indices:u,postModify:s},{regex:R,indices:k,postModify:d},{regex:Y,indices:{bucket:1,path:2},postModify:d}];for(let B=0;B<L.length;B++){let H=L[B],q=H.regex.exec(e);if(q){let w=q[H.indices.bucket],m=q[H.indices.path];m||(m=""),r=new n(w,m),H.postModify(r);break}}if(r==null)throw tS(e);return r}},yh=class{constructor(e){this.promise_=Promise.reject(e)}getPromise(){return this.promise_}cancel(e=!1){}};function iS(n,e,t){let r=1,i=null,s=null,a=!1,c=0;function u(){return c===2}let d=!1;function f(...N){d||(d=!0,e.apply(null,N))}function g(N){i=setTimeout(()=>{i=null,n(R,u())},N)}function b(){s&&clearTimeout(s)}function R(N,...Y){if(d){b();return}if(N){b(),f.call(null,N,...Y);return}if(u()||a){b(),f.call(null,N,...Y);return}r<64&&(r*=2);let L;c===1?(c=2,L=0):L=(r+Math.random())*1e3,g(L)}let k=!1;function O(N){k||(k=!0,b(),!d&&(i!==null?(N||(c=2),clearTimeout(i),g(0)):N||(c=1)))}return g(0),s=setTimeout(()=>{a=!0,O(!0)},t),O}function sS(n){n(!1)}function oS(n){return n!==void 0}function a_(n,e,t,r){if(r<e)throw o_(`Invalid value for '${n}'. Expected ${e} or greater.`);if(r>t)throw o_(`Invalid value for '${n}'. Expected ${t} or less.`)}function aS(n){let e=encodeURIComponent,t="?";for(let r in n)if(n.hasOwnProperty(r)){let i=e(r)+"="+e(n[r]);t=t+i+"&"}return t=t.slice(0,-1),t}var da;(function(n){n[n.NO_ERROR=0]="NO_ERROR",n[n.NETWORK_ERROR=1]="NETWORK_ERROR",n[n.ABORT=2]="ABORT"})(da||(da={}));function cS(n,e){let t=n>=500&&n<600,i=[408,429].indexOf(n)!==-1,s=e.indexOf(n)!==-1;return t||i||s}var wh=class{constructor(e,t,r,i,s,a,c,u,d,f,g,b=!0){this.url_=e,this.method_=t,this.headers_=r,this.body_=i,this.successCodes_=s,this.additionalRetryCodes_=a,this.callback_=c,this.errorCallback_=u,this.timeout_=d,this.progressCallback_=f,this.connectionFactory_=g,this.retry=b,this.pendingConnection_=null,this.backoffId_=null,this.canceled_=!1,this.appDelete_=!1,this.promise_=new Promise((R,k)=>{this.resolve_=R,this.reject_=k,this.start_()})}start_(){let e=(r,i)=>{if(i){r(!1,new wr(!1,null,!0));return}let s=this.connectionFactory_();this.pendingConnection_=s;let a=c=>{let u=c.loaded,d=c.lengthComputable?c.total:-1;this.progressCallback_!==null&&this.progressCallback_(u,d)};this.progressCallback_!==null&&s.addUploadProgressListener(a),s.send(this.url_,this.method_,this.body_,this.headers_).then(()=>{this.progressCallback_!==null&&s.removeUploadProgressListener(a),this.pendingConnection_=null;let c=s.getErrorCode()===da.NO_ERROR,u=s.getStatus();if(!c||cS(u,this.additionalRetryCodes_)&&this.retry){let f=s.getErrorCode()===da.ABORT;r(!1,new wr(!1,null,f));return}let d=this.successCodes_.indexOf(u)!==-1;r(!0,new wr(d,s))})},t=(r,i)=>{let s=this.resolve_,a=this.reject_,c=i.connection;if(i.wasSuccessCode)try{let u=this.callback_(c,c.getResponse());oS(u)?s(u):s()}catch(u){a(u)}else if(c!==null){let u=XA();u.serverResponse=c.getErrorText(),this.errorCallback_?a(this.errorCallback_(c,u)):a(u)}else if(i.canceled){let u=this.appDelete_?d_():eS();a(u)}else{let u=ZA();a(u)}};this.canceled_?t(!1,new wr(!1,null,!0)):this.backoffId_=iS(e,t,this.timeout_)}getPromise(){return this.promise_}cancel(e){this.canceled_=!0,this.appDelete_=e||!1,this.backoffId_!==null&&sS(this.backoffId_),this.pendingConnection_!==null&&this.pendingConnection_.abort()}},wr=class{constructor(e,t,r){this.wasSuccessCode=e,this.connection=t,this.canceled=!!r}};function uS(n,e){e!==null&&e.length>0&&(n.Authorization="Firebase "+e)}function lS(n,e){n["X-Firebase-Storage-Version"]="webjs/"+(e??"AppManager")}function hS(n,e){e&&(n["X-Firebase-GMPID"]=e)}function dS(n,e){e!==null&&(n["X-Firebase-AppCheck"]=e)}function fS(n,e,t,r,i,s,a=!0){let c=aS(n.urlParams),u=n.url+c,d=Object.assign({},n.headers);return hS(d,e),uS(d,t),lS(d,s),dS(d,r),new wh(u,n.method,d,n.body,n.successCodes,n.additionalRetryCodes,n.handler,n.errorHandler,n.timeout,n.progressCallback,i,a)}function pS(n){if(n.length===0)return null;let e=n.lastIndexOf("/");return e===-1?"":n.slice(0,e)}function mS(n){let e=n.lastIndexOf("/",n.length-2);return e===-1?n:n.slice(e+1)}var oP=256*1024;var vh=class n{constructor(e,t){this._service=e,t instanceof Rt?this._location=t:this._location=Rt.makeFromUrl(t,e.host)}toString(){return"gs://"+this._location.bucket+"/"+this._location.path}_newRef(e,t){return new n(e,t)}get root(){let e=new Rt(this._location.bucket,"");return this._newRef(this._service,e)}get bucket(){return this._location.bucket}get fullPath(){return this._location.path}get name(){return mS(this._location.path)}get storage(){return this._service}get parent(){let e=pS(this._location.path);if(e===null)return null;let t=new Rt(this._location.bucket,e);return new n(this._service,t)}_throwIfRoot(e){if(this._location.path==="")throw rS(e)}};function c_(n,e){let t=e?.[QA];return t==null?null:Rt.makeFromBucketSpec(t,n)}function gS(n,e,t,r={}){n.host=`${e}:${t}`,n._protocol="http";let{mockUserToken:i}=r;i&&(n._overrideAuthToken=typeof i=="string"?i:us(i,n.app.options.projectId))}var Ih=class{constructor(e,t,r,i,s){this.app=e,this._authProvider=t,this._appCheckProvider=r,this._url=i,this._firebaseVersion=s,this._bucket=null,this._host=h_,this._protocol="https",this._appId=null,this._deleted=!1,this._maxOperationRetryTime=YA,this._maxUploadRetryTime=JA,this._requests=new Set,i!=null?this._bucket=Rt.makeFromBucketSpec(i,this._host):this._bucket=c_(this._host,this.app.options)}get host(){return this._host}set host(e){this._host=e,this._url!=null?this._bucket=Rt.makeFromBucketSpec(this._url,e):this._bucket=c_(e,this.app.options)}get maxUploadRetryTime(){return this._maxUploadRetryTime}set maxUploadRetryTime(e){a_("time",0,Number.POSITIVE_INFINITY,e),this._maxUploadRetryTime=e}get maxOperationRetryTime(){return this._maxOperationRetryTime}set maxOperationRetryTime(e){a_("time",0,Number.POSITIVE_INFINITY,e),this._maxOperationRetryTime=e}async _getAuthToken(){if(this._overrideAuthToken)return this._overrideAuthToken;let e=this._authProvider.getImmediate({optional:!0});if(e){let t=await e.getToken();if(t!==null)return t.accessToken}return null}async _getAppCheckToken(){if(Ne(this.app)&&this.app.settings.appCheckToken)return this.app.settings.appCheckToken;let e=this._appCheckProvider.getImmediate({optional:!0});return e?(await e.getToken()).token:null}_delete(){return this._deleted||(this._deleted=!0,this._requests.forEach(e=>e.cancel()),this._requests.clear()),Promise.resolve()}_makeStorageReference(e){return new vh(this,e)}_makeRequest(e,t,r,i,s=!0){if(this._deleted)return new yh(d_());{let a=fS(e,this._appId,r,i,t,this._firebaseVersion,s);return this._requests.add(a),a.getPromise().then(()=>this._requests.delete(a),()=>this._requests.delete(a)),a}}async makeRequestWithTokens(e,t){let[r,i]=await Promise.all([this._getAuthToken(),this._getAppCheckToken()]);return this._makeRequest(e,t,r,i).getPromise()}},u_="@firebase/storage",l_="0.13.6";var f_="storage";function Th(n=Ve(),e){n=de(n);let r=pe(n,f_).getImmediate({identifier:e}),i=cs("storage");return i&&_S(r,...i),r}function _S(n,e,t,r={}){gS(n,e,t,r)}function yS(n,{instanceIdentifier:e}){let t=n.getProvider("app").getImmediate(),r=n.getProvider("auth-internal"),i=n.getProvider("app-check-internal");return new Ih(t,r,i,e,tt)}function wS(){oe(new te(f_,yS,"PUBLIC").setMultipleInstances(!0)),re(u_,l_,""),re(u_,l_,"esm2017")}wS();var Eh={apiKey:"AIzaSyBfhBZbRRVsARX5u0biqVHQA6vudYw2F8U",authDomain:"gacentral-53615.firebaseapp.com",projectId:"gacentral-53615",storageBucket:"gacentral-53615.firebasestorage.app",messagingSenderId:"467988177048",appId:"1:467988177048:web:5dd07a8fe519ec030a30ed",measurementId:"G-H9285DBXK7"},ft,p_,m_,vS=null,IS=null,g_;oc().length?(ft=oc()[0],p_=Jc(ft),m_=Og(ft),g_=Th(ft)):(ft=$r(Eh),p_=Qs(ft,{persistence:[Xs,Ys],popupRedirectResolver:Zs}),m_=Ng(ft,{localCache:xg({tabManager:th({forceOwnership:!0})})}),g_=Th(ft),Gg().then(n=>{n&&(vS=Kg(ft))}).catch(n=>{console.warn("Firebase Analytics initialization failed:",n)}),window.isSecureContext&&gh().then(n=>{n&&(IS=s_(ft))}).catch(n=>{console.warn("Firebase Cloud Messaging initialization failed:",n)}));var TS=$r(Eh),ES=Tf(TS);Ef(ES,n=>{console.log("[Firebase Messaging SW] Received background message:",n);let e=n.notification?.title||"New Message",t={body:n.notification?.body,icon:"/images/logo.svg",badge:"/images/logo.svg",tag:n.collapseKey||"default",data:n.data,requireInteraction:!0,silent:!1};return self.registration.showNotification(e,t)});self.addEventListener("notificationclick",n=>{n.notification.close();let e=n.notification.data?.clickAction||"/";n.waitUntil(self.clients.matchAll({type:"window",includeUncontrolled:!0}).then(t=>{for(let r of t)if(r.url===e&&"focus"in r)return r.focus();if(self.clients.openWindow)return self.clients.openWindow(e)}))});self.addEventListener("activate",n=>{n.waitUntil(Promise.all([self.clients.claim()]))});
/*! Bundled license information:

@firebase/util/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/util/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/util/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/util/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2022 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2021 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/util/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/util/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/util/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/util/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2022 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/util/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/util/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/util/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/util/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/util/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2021 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/component/dist/esm/index.esm2017.js:
  (**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/logger/dist/esm/index.esm2017.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/app/dist/esm/index.esm2017.js:
  (**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/app/dist/esm/index.esm2017.js:
  (**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2023 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/app/dist/esm/index.esm2017.js:
  (**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/app/dist/esm/index.esm2017.js:
  (**
   * @license
   * Copyright 2021 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

firebase/app/dist/esm/index.esm.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/installations/dist/esm/index.esm2017.js:
  (**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/installations/dist/esm/index.esm2017.js:
  (**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/installations/dist/esm/index.esm2017.js:
  (**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/installations/dist/esm/index.esm2017.js:
  (**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/installations/dist/esm/index.esm2017.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/installations/dist/esm/index.esm2017.js:
  (**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/messaging/dist/esm/index.sw.esm2017.js:
  (**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2018 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except
   * in compliance with the License. You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software distributed under the License
   * is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
   * or implied. See the License for the specific language governing permissions and limitations under
   * the License.
   *)
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/messaging/dist/esm/index.sw.esm2017.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/messaging/dist/esm/index.sw.esm2017.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth/dist/esm2017/index-dfc2d82f.js:
  (**
   * @license
   * Copyright 2021 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth/dist/esm2017/index-dfc2d82f.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth/dist/esm2017/index-dfc2d82f.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth/dist/esm2017/index-dfc2d82f.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth/dist/esm2017/index-dfc2d82f.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth/dist/esm2017/index-dfc2d82f.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth/dist/esm2017/index-dfc2d82f.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth/dist/esm2017/index-dfc2d82f.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth/dist/esm2017/index-dfc2d82f.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2022 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2023 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth/dist/esm2017/index-dfc2d82f.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth/dist/esm2017/index-dfc2d82f.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth/dist/esm2017/index-dfc2d82f.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth/dist/esm2017/index-dfc2d82f.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth/dist/esm2017/index-dfc2d82f.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth/dist/esm2017/index-dfc2d82f.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth/dist/esm2017/index-dfc2d82f.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth/dist/esm2017/index-dfc2d82f.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth/dist/esm2017/index-dfc2d82f.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth/dist/esm2017/index-dfc2d82f.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth/dist/esm2017/index-dfc2d82f.js:
  (**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth/dist/esm2017/index-dfc2d82f.js:
  (**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth/dist/esm2017/index-dfc2d82f.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth/dist/esm2017/index-dfc2d82f.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth/dist/esm2017/index-dfc2d82f.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth/dist/esm2017/index-dfc2d82f.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth/dist/esm2017/index-dfc2d82f.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth/dist/esm2017/index-dfc2d82f.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth/dist/esm2017/index-dfc2d82f.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth/dist/esm2017/index-dfc2d82f.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth/dist/esm2017/index-dfc2d82f.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth/dist/esm2017/index-dfc2d82f.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth/dist/esm2017/index-dfc2d82f.js:
  (**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth/dist/esm2017/index-dfc2d82f.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth/dist/esm2017/index-dfc2d82f.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth/dist/esm2017/index-dfc2d82f.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth/dist/esm2017/index-dfc2d82f.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth/dist/esm2017/index-dfc2d82f.js:
  (**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2020 Google LLC.
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth/dist/esm2017/index-dfc2d82f.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth/dist/esm2017/index-dfc2d82f.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth/dist/esm2017/index-dfc2d82f.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2021 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth/dist/esm2017/index-dfc2d82f.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth/dist/esm2017/index-dfc2d82f.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth/dist/esm2017/index-dfc2d82f.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2020 Google LLC.
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2021 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/webchannel-wrapper/dist/bloom-blob/esm/bloom_blob_es2018.js:
  (** @license
  Copyright The Closure Library Authors.
  SPDX-License-Identifier: Apache-2.0
  *)
  (** @license
  
   Copyright The Closure Library Authors.
   SPDX-License-Identifier: Apache-2.0
  *)

@firebase/webchannel-wrapper/dist/webchannel-blob/esm/webchannel_blob_es2018.js:
  (** @license
  Copyright The Closure Library Authors.
  SPDX-License-Identifier: Apache-2.0
  *)
  (** @license
  
   Copyright The Closure Library Authors.
   SPDX-License-Identifier: Apache-2.0
  *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
  * @license
  * Copyright 2020 Google LLC
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *   http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  *)
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2021 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2018 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2022 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2023 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2022 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2018 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2022 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2023 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2023 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2023 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2022 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2022 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2024 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2021 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2021 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law | agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES | CONDITIONS OF ANY KIND, either express | implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2018 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2023 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2018 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2023 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2023 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2022 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2024 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2022 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2022 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2022 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2021 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2023 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2023 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/analytics/dist/esm/index.esm2017.js:
  (**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/analytics/dist/esm/index.esm2017.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/messaging/dist/esm/index.esm2017.js:
  (**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2018 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except
   * in compliance with the License. You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software distributed under the License
   * is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
   * or implied. See the License for the specific language governing permissions and limitations under
   * the License.
   *)
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/messaging/dist/esm/index.esm2017.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/messaging/dist/esm/index.esm2017.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/messaging/dist/esm/index.esm2017.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/messaging/dist/esm/index.esm2017.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/storage/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/storage/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/storage/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/storage/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/storage/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2022 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/storage/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2021 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/storage/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/storage/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/storage/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/storage/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/storage/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/storage/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/storage/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/storage/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/storage/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/storage/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/storage/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/storage/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/storage/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/storage/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/storage/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/storage/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2021 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
*/
//# sourceMappingURL=firebase-messaging-sw.js.map
