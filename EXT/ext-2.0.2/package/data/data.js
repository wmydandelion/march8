/*
 * Ext JS Library 2.0.2
 * Copyright(c) 2006-2008, Ext JS, LLC.
 * licensing@extjs.com
 * 
 * http://extjs.com/license
 */

Ext.data.SortTypes={none:function(A){return A},stripTagsRE:/<\/?[^>]+>/gi,asText:function(A){return String(A).replace(this.stripTagsRE,"")},asUCText:function(A){return String(A).toUpperCase().replace(this.stripTagsRE,"")},asUCString:function(A){return String(A).toUpperCase()},asDate:function(A){if(!A){return 0}if(Ext.isDate(A)){return A.getTime()}return Date.parse(String(A))},asFloat:function(A){var B=parseFloat(String(A).replace(/,/g,""));if(isNaN(B)){B=0}return B},asInt:function(A){var B=parseInt(String(A).replace(/,/g,""));if(isNaN(B)){B=0}return B}};
Ext.data.Record=function(A,B){this.id=(B||B===0)?B:++Ext.data.Record.AUTO_ID;this.data=A};Ext.data.Record.create=function(E){var C=Ext.extend(Ext.data.Record,{});var D=C.prototype;D.fields=new Ext.util.MixedCollection(false,function(F){return F.name});for(var B=0,A=E.length;B<A;B++){D.fields.add(new Ext.data.Field(E[B]))}C.getField=function(F){return D.fields.get(F)};return C};Ext.data.Record.AUTO_ID=1000;Ext.data.Record.EDIT="edit";Ext.data.Record.REJECT="reject";Ext.data.Record.COMMIT="commit";Ext.data.Record.prototype={dirty:false,editing:false,error:null,modified:null,join:function(A){this.store=A},set:function(A,B){if(String(this.data[A])==String(B)){return }this.dirty=true;if(!this.modified){this.modified={}}if(typeof this.modified[A]=="undefined"){this.modified[A]=this.data[A]}this.data[A]=B;if(!this.editing&&this.store){this.store.afterEdit(this)}},get:function(A){return this.data[A]},beginEdit:function(){this.editing=true;this.modified={}},cancelEdit:function(){this.editing=false;delete this.modified},endEdit:function(){this.editing=false;if(this.dirty&&this.store){this.store.afterEdit(this)}},reject:function(B){var A=this.modified;for(var C in A){if(typeof A[C]!="function"){this.data[C]=A[C]}}this.dirty=false;delete this.modified;this.editing=false;if(this.store&&B!==true){this.store.afterReject(this)}},commit:function(A){this.dirty=false;delete this.modified;this.editing=false;if(this.store&&A!==true){this.store.afterCommit(this)}},getChanges:function(){var A=this.modified,B={};for(var C in A){if(A.hasOwnProperty(C)){B[C]=this.data[C]}}return B},hasError:function(){return this.error!=null},clearError:function(){this.error=null},copy:function(A){return new this.constructor(Ext.apply({},this.data),A||this.id)},isModified:function(A){return this.modified&&this.modified.hasOwnProperty(A)}};
Ext.StoreMgr=Ext.apply(new Ext.util.MixedCollection(),{register:function(){for(var A=0,B;B=arguments[A];A++){this.add(B)}},unregister:function(){for(var A=0,B;B=arguments[A];A++){this.remove(this.lookup(B))}},lookup:function(A){return typeof A=="object"?A:this.get(A)},getKey:function(A){return A.storeId||A.id}});
Ext.data.Store=function(A){this.data=new Ext.util.MixedCollection(false);this.data.getKey=function(B){return B.id};this.baseParams={};this.paramNames={"start":"start","limit":"limit","sort":"sort","dir":"dir"};if(A&&A.data){this.inlineData=A.data;delete A.data}Ext.apply(this,A);if(this.url&&!this.proxy){this.proxy=new Ext.data.HttpProxy({url:this.url})}if(this.reader){if(!this.recordType){this.recordType=this.reader.recordType}if(this.reader.onMetaChange){this.reader.onMetaChange=this.onMetaChange.createDelegate(this)}}if(this.recordType){this.fields=this.recordType.prototype.fields}this.modified=[];this.addEvents("datachanged","metachange","add","remove","update","clear","beforeload","load","loadexception");if(this.proxy){this.relayEvents(this.proxy,["loadexception"])}this.sortToggle={};if(this.sortInfo){this.setDefaultSort(this.sortInfo.field,this.sortInfo.direction)}Ext.data.Store.superclass.constructor.call(this);if(this.storeId||this.id){Ext.StoreMgr.register(this)}if(this.inlineData){this.loadData(this.inlineData);delete this.inlineData}else{if(this.autoLoad){this.load.defer(10,this,[typeof this.autoLoad=="object"?this.autoLoad:undefined])}}};Ext.extend(Ext.data.Store,Ext.util.Observable,{remoteSort:false,pruneModifiedRecords:false,lastOptions:null,destroy:function(){if(this.id){Ext.StoreMgr.unregister(this)}this.data=null;this.purgeListeners()},add:function(B){B=[].concat(B);if(B.length<1){return }for(var D=0,A=B.length;D<A;D++){B[D].join(this)}var C=this.data.length;this.data.addAll(B);if(this.snapshot){this.snapshot.addAll(B)}this.fireEvent("add",this,B,C)},addSorted:function(A){var B=this.findInsertIndex(A);this.insert(B,A)},remove:function(A){var B=this.data.indexOf(A);this.data.removeAt(B);if(this.pruneModifiedRecords){this.modified.remove(A)}if(this.snapshot){this.snapshot.remove(A)}this.fireEvent("remove",this,A,B)},removeAll:function(){this.data.clear();if(this.snapshot){this.snapshot.clear()}if(this.pruneModifiedRecords){this.modified=[]}this.fireEvent("clear",this)},insert:function(C,B){B=[].concat(B);for(var D=0,A=B.length;D<A;D++){this.data.insert(C,B[D]);B[D].join(this)}this.fireEvent("add",this,B,C)},indexOf:function(A){return this.data.indexOf(A)},indexOfId:function(A){return this.data.indexOfKey(A)},getById:function(A){return this.data.key(A)},getAt:function(A){return this.data.itemAt(A)},getRange:function(B,A){return this.data.getRange(B,A)},storeOptions:function(A){A=Ext.apply({},A);delete A.callback;delete A.scope;this.lastOptions=A},load:function(B){B=B||{};if(this.fireEvent("beforeload",this,B)!==false){this.storeOptions(B);var C=Ext.apply(B.params||{},this.baseParams);if(this.sortInfo&&this.remoteSort){var A=this.paramNames;C[A["sort"]]=this.sortInfo.field;C[A["dir"]]=this.sortInfo.direction}this.proxy.load(C,this.reader,this.loadRecords,this,B);return true}else{return false}},reload:function(A){this.load(Ext.applyIf(A||{},this.lastOptions))},loadRecords:function(G,B,F){if(!G||F===false){if(F!==false){this.fireEvent("load",this,[],B)}if(B.callback){B.callback.call(B.scope||this,[],B,false)}return }var E=G.records,D=G.totalRecords||E.length;if(!B||B.add!==true){if(this.pruneModifiedRecords){this.modified=[]}for(var C=0,A=E.length;C<A;C++){E[C].join(this)}if(this.snapshot){this.data=this.snapshot;delete this.snapshot}this.data.clear();this.data.addAll(E);this.totalLength=D;this.applySort();this.fireEvent("datachanged",this)}else{this.totalLength=Math.max(D,this.data.length+E.length);this.add(E)}this.fireEvent("load",this,E,B);if(B.callback){B.callback.call(B.scope||this,E,B,true)}},loadData:function(C,A){var B=this.reader.readRecords(C);this.loadRecords(B,{add:A},true)},getCount:function(){return this.data.length||0},getTotalCount:function(){return this.totalLength||0},getSortState:function(){return this.sortInfo},applySort:function(){if(this.sortInfo&&!this.remoteSort){var A=this.sortInfo,B=A.field;this.sortData(B,A.direction)}},sortData:function(C,D){D=D||"ASC";var A=this.fields.get(C).sortType;var B=function(F,E){var H=A(F.data[C]),G=A(E.data[C]);return H>G?1:(H<G?-1:0)};this.data.sort(D,B);if(this.snapshot&&this.snapshot!=this.data){this.snapshot.sort(D,B)}},setDefaultSort:function(B,A){A=A?A.toUpperCase():"ASC";this.sortInfo={field:B,direction:A};this.sortToggle[B]=A},sort:function(E,C){var D=this.fields.get(E);if(!D){return false}if(!C){if(this.sortInfo&&this.sortInfo.field==D.name){C=(this.sortToggle[D.name]||"ASC").toggle("ASC","DESC")}else{C=D.sortDir}}var B=(this.sortToggle)?this.sortToggle[D.name]:null;var A=(this.sortInfo)?this.sortInfo:null;this.sortToggle[D.name]=C;this.sortInfo={field:D.name,direction:C};if(!this.remoteSort){this.applySort();this.fireEvent("datachanged",this)}else{if(!this.load(this.lastOptions)){if(B){this.sortToggle[D.name]=B}if(A){this.sortInfo=A}}}},each:function(B,A){this.data.each(B,A)},getModifiedRecords:function(){return this.modified},createFilterFn:function(C,B,D,A){if(Ext.isEmpty(B,false)){return false}B=this.data.createValueMatcher(B,D,A);return function(E){return B.test(E.data[C])}},sum:function(E,F,A){var C=this.data.items,B=0;F=F||0;A=(A||A===0)?A:C.length-1;for(var D=F;D<=A;D++){B+=(C[D].data[E]||0)}return B},filter:function(D,C,E,A){var B=this.createFilterFn(D,C,E,A);return B?this.filterBy(B):this.clearFilter()},filterBy:function(B,A){this.snapshot=this.snapshot||this.data;this.data=this.queryBy(B,A||this);this.fireEvent("datachanged",this)},query:function(D,C,E,A){var B=this.createFilterFn(D,C,E,A);return B?this.queryBy(B):this.data.clone()},queryBy:function(B,A){var C=this.snapshot||this.data;return C.filterBy(B,A||this)},find:function(D,C,F,E,A){var B=this.createFilterFn(D,C,E,A);return B?this.data.findIndexBy(B,null,F):-1},findBy:function(B,A,C){return this.data.findIndexBy(B,A,C)},collect:function(G,H,B){var F=(B===true&&this.snapshot)?this.snapshot.items:this.data.items;var I,J,A=[],C={};for(var D=0,E=F.length;D<E;D++){I=F[D].data[G];J=String(I);if((H||!Ext.isEmpty(I))&&!C[J]){C[J]=true;A[A.length]=I}}return A},clearFilter:function(A){if(this.isFiltered()){this.data=this.snapshot;delete this.snapshot;if(A!==true){this.fireEvent("datachanged",this)}}},isFiltered:function(){return this.snapshot&&this.snapshot!=this.data},afterEdit:function(A){if(this.modified.indexOf(A)==-1){this.modified.push(A)}this.fireEvent("update",this,A,Ext.data.Record.EDIT)},afterReject:function(A){this.modified.remove(A);this.fireEvent("update",this,A,Ext.data.Record.REJECT)},afterCommit:function(A){this.modified.remove(A);this.fireEvent("update",this,A,Ext.data.Record.COMMIT)},commitChanges:function(){var B=this.modified.slice(0);this.modified=[];for(var C=0,A=B.length;C<A;C++){B[C].commit()}},rejectChanges:function(){var B=this.modified.slice(0);this.modified=[];for(var C=0,A=B.length;C<A;C++){B[C].reject()}},onMetaChange:function(B,A,C){this.recordType=A;this.fields=A.prototype.fields;delete this.snapshot;this.sortInfo=B.sortInfo;this.modified=[];this.fireEvent("metachange",this,this.reader.meta)},findInsertIndex:function(A){this.suspendEvents();var C=this.data.clone();this.data.add(A);this.applySort();var B=this.data.indexOf(A);this.data=C;this.resumeEvents();return B}});
Ext.data.SimpleStore=function(A){Ext.data.SimpleStore.superclass.constructor.call(this,Ext.apply(A,{reader:new Ext.data.ArrayReader({id:A.id},Ext.data.Record.create(A.fields))}))};Ext.extend(Ext.data.SimpleStore,Ext.data.Store,{loadData:function(E,B){if(this.expandData===true){var D=[];for(var C=0,A=E.length;C<A;C++){D[D.length]=[E[C]]}E=D}Ext.data.SimpleStore.superclass.loadData.call(this,E,B)}});
Ext.data.Connection=function(A){Ext.apply(this,A);this.addEvents("beforerequest","requestcomplete","requestexception");Ext.data.Connection.superclass.constructor.call(this)};Ext.extend(Ext.data.Connection,Ext.util.Observable,{timeout:30000,autoAbort:false,disableCaching:true,request:function(E){if(this.fireEvent("beforerequest",this,E)!==false){var C=E.params;if(typeof C=="function"){C=C.call(E.scope||window,E)}if(typeof C=="object"){C=Ext.urlEncode(C)}if(this.extraParams){var G=Ext.urlEncode(this.extraParams);C=C?(C+"&"+G):G}var B=E.url||this.url;if(typeof B=="function"){B=B.call(E.scope||window,E)}if(E.form){var D=Ext.getDom(E.form);B=B||D.action;var I=D.getAttribute("enctype");if(E.isUpload||(I&&I.toLowerCase()=="multipart/form-data")){return this.doFormUpload(E,C,B)}var H=Ext.lib.Ajax.serializeForm(D);C=C?(C+"&"+H):H}var J=E.headers;if(this.defaultHeaders){J=Ext.apply(J||{},this.defaultHeaders);if(!E.headers){E.headers=J}}var F={success:this.handleResponse,failure:this.handleFailure,scope:this,argument:{options:E},timeout:E.timeout||this.timeout};var A=E.method||this.method||(C?"POST":"GET");if(A=="GET"&&(this.disableCaching&&E.disableCaching!==false)||E.disableCaching===true){B+=(B.indexOf("?")!=-1?"&":"?")+"_dc="+(new Date().getTime())}if(typeof E.autoAbort=="boolean"){if(E.autoAbort){this.abort()}}else{if(this.autoAbort!==false){this.abort()}}if((A=="GET"&&C)||E.xmlData||E.jsonData){B+=(B.indexOf("?")!=-1?"&":"?")+C;C=""}this.transId=Ext.lib.Ajax.request(A,B,F,C,E);return this.transId}else{Ext.callback(E.callback,E.scope,[E,null,null]);return null}},isLoading:function(A){if(A){return Ext.lib.Ajax.isCallInProgress(A)}else{return this.transId?true:false}},abort:function(A){if(A||this.isLoading()){Ext.lib.Ajax.abort(A||this.transId)}},handleResponse:function(A){this.transId=false;var B=A.argument.options;A.argument=B?B.argument:null;this.fireEvent("requestcomplete",this,A,B);Ext.callback(B.success,B.scope,[A,B]);Ext.callback(B.callback,B.scope,[B,true,A])},handleFailure:function(A,C){this.transId=false;var B=A.argument.options;A.argument=B?B.argument:null;this.fireEvent("requestexception",this,A,B,C);Ext.callback(B.failure,B.scope,[A,B]);Ext.callback(B.callback,B.scope,[B,false,A])},doFormUpload:function(E,A,B){var C=Ext.id();var F=document.createElement("iframe");F.id=C;F.name=C;F.className="x-hidden";if(Ext.isIE){F.src=Ext.SSL_SECURE_URL}document.body.appendChild(F);if(Ext.isIE){document.frames[C].name=C}var D=Ext.getDom(E.form);D.target=C;D.method="POST";D.enctype=D.encoding="multipart/form-data";if(B){D.action=B}var L,J;if(A){L=[];A=Ext.urlDecode(A,false);for(var H in A){if(A.hasOwnProperty(H)){J=document.createElement("input");J.type="hidden";J.name=H;J.value=A[H];D.appendChild(J);L.push(J)}}}function G(){var M={responseText:"",responseXML:null};M.argument=E?E.argument:null;try{var O;if(Ext.isIE){O=F.contentWindow.document}else{O=(F.contentDocument||window.frames[C].document)}if(O&&O.body){M.responseText=O.body.innerHTML}if(O&&O.XMLDocument){M.responseXML=O.XMLDocument}else{M.responseXML=O}}catch(N){}Ext.EventManager.removeListener(F,"load",G,this);this.fireEvent("requestcomplete",this,M,E);Ext.callback(E.success,E.scope,[M,E]);Ext.callback(E.callback,E.scope,[E,true,M]);setTimeout(function(){Ext.removeNode(F)},100)}Ext.EventManager.on(F,"load",G,this);D.submit();if(L){for(var I=0,K=L.length;I<K;I++){Ext.removeNode(L[I])}}}});Ext.Ajax=new Ext.data.Connection({autoAbort:false,serializeForm:function(A){return Ext.lib.Ajax.serializeForm(A)}});
Ext.data.Field=function(D){if(typeof D=="string"){D={name:D}}Ext.apply(this,D);if(!this.type){this.type="auto"}var C=Ext.data.SortTypes;if(typeof this.sortType=="string"){this.sortType=C[this.sortType]}if(!this.sortType){switch(this.type){case"string":this.sortType=C.asUCString;break;case"date":this.sortType=C.asDate;break;default:this.sortType=C.none}}var E=/[\$,%]/g;if(!this.convert){var B,A=this.dateFormat;switch(this.type){case"":case"auto":case undefined:B=function(F){return F};break;case"string":B=function(F){return(F===undefined||F===null)?"":String(F)};break;case"int":B=function(F){return F!==undefined&&F!==null&&F!==""?parseInt(String(F).replace(E,""),10):""};break;case"float":B=function(F){return F!==undefined&&F!==null&&F!==""?parseFloat(String(F).replace(E,""),10):""};break;case"bool":case"boolean":B=function(F){return F===true||F==="true"||F==1};break;case"date":B=function(G){if(!G){return""}if(Ext.isDate(G)){return G}if(A){if(A=="timestamp"){return new Date(G*1000)}if(A=="time"){return new Date(parseInt(G,10))}return Date.parseDate(G,A)}var F=Date.parse(G);return F?new Date(F):null};break}this.convert=B}};Ext.data.Field.prototype={dateFormat:null,defaultValue:"",mapping:null,sortType:null,sortDir:"ASC"};
Ext.data.DataReader=function(A,B){this.meta=A;this.recordType=Ext.isArray(B)?Ext.data.Record.create(B):B};Ext.data.DataReader.prototype={};
Ext.data.DataProxy=function(){this.addEvents("beforeload","load","loadexception");Ext.data.DataProxy.superclass.constructor.call(this)};Ext.extend(Ext.data.DataProxy,Ext.util.Observable);
Ext.data.MemoryProxy=function(A){Ext.data.MemoryProxy.superclass.constructor.call(this);this.data=A};Ext.extend(Ext.data.MemoryProxy,Ext.data.DataProxy,{load:function(F,C,G,D,B){F=F||{};var A;try{A=C.readRecords(this.data)}catch(E){this.fireEvent("loadexception",this,B,null,E);G.call(D,null,B,false);return }G.call(D,A,B,true)},update:function(B,A){}});
Ext.data.HttpProxy=function(A){Ext.data.HttpProxy.superclass.constructor.call(this);this.conn=A;this.useAjax=!A||!A.events};Ext.extend(Ext.data.HttpProxy,Ext.data.DataProxy,{getConnection:function(){return this.useAjax?Ext.Ajax:this.conn},load:function(E,B,F,C,A){if(this.fireEvent("beforeload",this,E)!==false){var D={params:E||{},request:{callback:F,scope:C,arg:A},reader:B,callback:this.loadResponse,scope:this};if(this.useAjax){Ext.applyIf(D,this.conn);if(this.activeRequest){Ext.Ajax.abort(this.activeRequest)}this.activeRequest=Ext.Ajax.request(D)}else{this.conn.request(D)}}else{F.call(C||this,null,A,false)}},loadResponse:function(E,D,B){delete this.activeRequest;if(!D){this.fireEvent("loadexception",this,E,B);E.request.callback.call(E.request.scope,null,E.request.arg,false);return }var A;try{A=E.reader.read(B)}catch(C){this.fireEvent("loadexception",this,E,B,C);E.request.callback.call(E.request.scope,null,E.request.arg,false);return }this.fireEvent("load",this,E,E.request.arg);E.request.callback.call(E.request.scope,A,E.request.arg,true)},update:function(A){},updateResponse:function(A){}});
Ext.data.ScriptTagProxy=function(A){Ext.data.ScriptTagProxy.superclass.constructor.call(this);Ext.apply(this,A);this.head=document.getElementsByTagName("head")[0]};Ext.data.ScriptTagProxy.TRANS_ID=1000;Ext.extend(Ext.data.ScriptTagProxy,Ext.data.DataProxy,{timeout:30000,callbackParam:"callback",nocache:true,load:function(E,F,H,I,J){if(this.fireEvent("beforeload",this,E)!==false){var C=Ext.urlEncode(Ext.apply(E,this.extraParams));var B=this.url;B+=(B.indexOf("?")!=-1?"&":"?")+C;if(this.nocache){B+="&_dc="+(new Date().getTime())}var A=++Ext.data.ScriptTagProxy.TRANS_ID;var K={id:A,cb:"stcCallback"+A,scriptId:"stcScript"+A,params:E,arg:J,url:B,callback:H,scope:I,reader:F};var D=this;window[K.cb]=function(L){D.handleResponse(L,K)};B+=String.format("&{0}={1}",this.callbackParam,K.cb);if(this.autoAbort!==false){this.abort()}K.timeoutId=this.handleFailure.defer(this.timeout,this,[K]);var G=document.createElement("script");G.setAttribute("src",B);G.setAttribute("type","text/javascript");G.setAttribute("id",K.scriptId);this.head.appendChild(G);this.trans=K}else{H.call(I||this,null,J,false)}},isLoading:function(){return this.trans?true:false},abort:function(){if(this.isLoading()){this.destroyTrans(this.trans)}},destroyTrans:function(B,A){this.head.removeChild(document.getElementById(B.scriptId));clearTimeout(B.timeoutId);if(A){window[B.cb]=undefined;try{delete window[B.cb]}catch(C){}}else{window[B.cb]=function(){window[B.cb]=undefined;try{delete window[B.cb]}catch(D){}}}},handleResponse:function(D,B){this.trans=false;this.destroyTrans(B,true);var A;try{A=B.reader.readRecords(D)}catch(C){this.fireEvent("loadexception",this,D,B.arg,C);B.callback.call(B.scope||window,null,B.arg,false);return }this.fireEvent("load",this,D,B.arg);B.callback.call(B.scope||window,A,B.arg,true)},handleFailure:function(A){this.trans=false;this.destroyTrans(A,false);this.fireEvent("loadexception",this,null,A.arg);A.callback.call(A.scope||window,null,A.arg,false)}});
Ext.data.JsonReader=function(A,B){A=A||{};Ext.data.JsonReader.superclass.constructor.call(this,A,B||A.fields)};Ext.extend(Ext.data.JsonReader,Ext.data.DataReader,{read:function(response){var json=response.responseText;var o=eval("("+json+")");if(!o){throw {message:"JsonReader.read: Json object not found"}}if(o.metaData){delete this.ef;this.meta=o.metaData;this.recordType=Ext.data.Record.create(o.metaData.fields);this.onMetaChange(this.meta,this.recordType,o)}return this.readRecords(o)},onMetaChange:function(A,C,B){},simpleAccess:function(B,A){return B[A]},getJsonAccessor:function(){var A=/[\[\.]/;return function(C){try{return(A.test(C))?new Function("obj","return obj."+C):function(D){return D[C]}}catch(B){}return Ext.emptyFn}}(),readRecords:function(K){this.jsonData=K;var H=this.meta,A=this.recordType,R=A.prototype.fields,F=R.items,E=R.length;if(!this.ef){if(H.totalProperty){this.getTotal=this.getJsonAccessor(H.totalProperty)}if(H.successProperty){this.getSuccess=this.getJsonAccessor(H.successProperty)}this.getRoot=H.root?this.getJsonAccessor(H.root):function(U){return U};if(H.id){var Q=this.getJsonAccessor(H.id);this.getId=function(V){var U=Q(V);return(U===undefined||U==="")?null:U}}else{this.getId=function(){return null}}this.ef=[];for(var O=0;O<E;O++){R=F[O];var T=(R.mapping!==undefined&&R.mapping!==null)?R.mapping:R.name;this.ef[O]=this.getJsonAccessor(T)}}var M=this.getRoot(K),S=M.length,I=S,D=true;if(H.totalProperty){var G=parseInt(this.getTotal(K),10);if(!isNaN(G)){I=G}}if(H.successProperty){var G=this.getSuccess(K);if(G===false||G==="false"){D=false}}var P=[];for(var O=0;O<S;O++){var L=M[O];var B={};var J=this.getId(L);for(var N=0;N<E;N++){R=F[N];var G=this.ef[N](L);B[R.name]=R.convert((G!==undefined)?G:R.defaultValue,L)}var C=new A(B,J);C.json=L;P[O]=C}return{success:D,records:P,totalRecords:I}}});
Ext.data.XmlReader=function(A,B){A=A||{};Ext.data.XmlReader.superclass.constructor.call(this,A,B||A.fields)};Ext.extend(Ext.data.XmlReader,Ext.data.DataReader,{read:function(A){var B=A.responseXML;if(!B){throw {message:"XmlReader.read: XML Document not available"}}return this.readRecords(B)},readRecords:function(T){this.xmlData=T;var N=T.documentElement||T;var I=Ext.DomQuery;var B=this.recordType,L=B.prototype.fields;var D=this.meta.id;var G=0,E=true;if(this.meta.totalRecords){G=I.selectNumber(this.meta.totalRecords,N,0)}if(this.meta.success){var K=I.selectValue(this.meta.success,N,true);E=K!==false&&K!=="false"}var Q=[];var U=I.select(this.meta.record,N);for(var P=0,R=U.length;P<R;P++){var M=U[P];var A={};var J=D?I.selectValue(D,M):undefined;for(var O=0,H=L.length;O<H;O++){var S=L.items[O];var F=I.selectValue(S.mapping||S.name,M,S.defaultValue);F=S.convert(F,M);A[S.name]=F}var C=new B(A,J);C.node=M;Q[Q.length]=C}return{success:E,records:Q,totalRecords:G||Q.length}}});
Ext.data.ArrayReader=Ext.extend(Ext.data.JsonReader,{readRecords:function(C){var B=this.meta?this.meta.id:null;var G=this.recordType,K=G.prototype.fields;var E=[];var M=C;for(var I=0;I<M.length;I++){var D=M[I];var O={};var A=((B||B===0)&&D[B]!==undefined&&D[B]!==""?D[B]:null);for(var H=0,P=K.length;H<P;H++){var L=K.items[H];var F=L.mapping!==undefined&&L.mapping!==null?L.mapping:H;var N=D[F]!==undefined?D[F]:L.defaultValue;N=L.convert(N,D);O[L.name]=N}var J=new G(O,A);J.json=D;E[E.length]=J}return{records:E,totalRecords:E.length}}});
