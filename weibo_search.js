var num=0;
var page = new WebPage(),
    url = 'http://www.weibo.com';
var weibo;
var user_name;
var password;
var keyword;
var search_flag=0;  //搜索标志位  如果为1 那么是含关键字的搜索  如果位0 那么是搜索自己发过的微博

//console.log(search_key)
if (phantom.args.length <=1) {
    console.log('Too little arguments');
	console.log('-u: username/email\n-p: password \n-k: keword');
	console.log('eg: phantomjs -ucxf -p123 -k123');
    phantom.exit();
	
} 
else 
{
  if(phantom.args.length ==2)
     {var arg_email=phantom.args[0];
	  var arg_password=phantom.args[1];
	  var re_email=/^-u(.+?)$/gi;
	  var re_password=/^-p(.+?)$/gi;
	  var result_email=re_email.exec(arg_email);
	  var result_password=re_password.exec(arg_password);
	  if(result_email==null||result_password==null)
		  {
		   console.log('unclear agruments format');
		   console.log('-u: username/email\n-p: password \n-k: keword');
		   console.log('eg: phantomjs -ucxf -p123 -k123');
		   phantom.exit();
		  }
	  user_name=result_email[1];
	  password=result_password[1];
	  //console.log(user_name);
	  //console.log(password);
	  search_flag=0;
	  
	}
  else if(phantom.args.length==3)
     {
	  var arg_email=phantom.args[0];
	  var arg_password=phantom.args[1];
	  var arg_keyword=phantom.args[2];
	  var re_email=/^-u(.+?)$/gi;
	  var re_password=/^-p(.+?)$/gi;
	  var re_keyword=/^-k(.+?)$/gi;
	  var result_email=re_email.exec(arg_email);
	  var result_password=re_password.exec(arg_password);
	  var result_keyword=re_keyword.exec(arg_keyword);
	  if(result_email==null||result_password==null||result_keyword==null)
		  {
		   console.log('unclear agruments format');
		   console.log('-u: username/email\n-p: password \n-k: keword');
		   console.log('eg: phantomjs -ucxf -p123 -k123');
		   phantom.exit();
		  }
	  user_name=result_email[1];
	  password=result_password[1];
	  keyword=result_keyword[1];
	  search_flag=1;
	 
	 }
  else 
    {
	 console.log('unclear agruments format');
     console.log('-u: username/email\n-p: password \n-k: keword');
     console.log('eg: phantomjs -ucxf -p123 -k123');
     phantom.exit();
	}
	
}

page.open(url, function (status) {
    if (status !== 'success') {
        console.log('Unable to access network');
    } 
	else
	   {
		
	  var ur=page.evaluate(function(){return document.URL;});
	  console.log("url:  "+ur+"   num:  "+num);
  	 // reg=/http:\/\/weibo.com\//gi;
	 // var ur_match=ur.match(reg);
	 // if(ur_match.length>=1)console.log(ur_match[0]);
	 
	  
	  
		if(ur=="http://weibo.com/")
			{	
				eval("function fn() {\
				document.getElementById('loginname').value='"+user_name+"';\
				document.getElementById('password').value='"+password+"';\
					var click_this = document.getElementById('login_submit_btn');\
						  if (document.createEvent)\
						  {\
							var evObj = document.createEvent('MouseEvents');\
							evObj.initEvent( 'click', true, false );\
						   click_this.dispatchEvent(evObj);\
						  }\
						  else if (document.createEventObject)\
						  {\
							   click_this.fireEvent('onclick');\
						  }\
						  }");
            
				
				page.evaluate(fn);
			}
			
	   else 
	     {var re=/^http:\/\/weibo.com\/u\/(\d*?)/;
		 if(re.exec(ur)!=null)
				 {      
 					    var temp=re.exec(ur);
                        var uid=temp[1];						
						num++; 
						 //eval("function fn() { document.getElementById('kw').value='" + value + "';}");
						
						  if(search_flag==0)
						   eval("function fn() { window.location.href='http://weibo.com/"+uid+"/profile';}");
						  else if(search_flag==1)
						   eval("function fn() { window.location.href=\"http://s.weibo.com/weibo/"+keyword+"&topnav=1\";}");
						 page.evaluate(fn);
						 //http://s.weibo.com/weibo/darbra&topnav=1
						
			   }
			   
		   else{
			     if(search_flag==0)
				    {
					 var all_weibos=page.evaluate(function() 
					 {
					  var weibo="",detail;
					  var re=/<dl action-type="feed_list_item" mid="(.*?)".*?<dd class="content">(.*?)<\/dd><\/dl>/gi;
					  var html=document.getElementById('pl_content_myFeed').innerHTML;
					  html=html.replace(/[\f\n\r\t\v]/gi,"");
					  var result=html.match(re);
					  for(i=0;i<result.length;i++)
					   {  var re=/<dl action-type="feed_list_item" mid="(.*?)".*?<dd class="content">(.*?)<\/dd><\/dl>/gi;
						 detail=re.exec(result[i]);
						 weibo+="\nmid: "+detail[1]+"\n"+"weibo: "+detail[2]+"\n";
						 
					   }
					 
					  return weibo;
					});
					
					 console.log(all_weibos);
				     phantom.exit();
					 
					 
					 
					 
					}
				 else if(search_flag==1)
					{
					  var all_weibos=page.evaluate(function() {
					  var weibo="",detail;
					   
					  //<a  usercard="唐伟杰halcott" usercardUid="1676467607"  href="http://weibo.com/halcott" target="_blank" title="唐伟杰halcott" nick-name="唐伟杰halcott" onclick="GB_SUDA._S_uaTrack('tblog_search_v4','weibo_feed_name_1');">唐伟杰halcott<img src="http://img.t.sinajs.cn/t4/style/images/common/transparent.gif?version=201111221805" alt="" class="ico_club" width="11" height="10"/></a>：<em><a usercard="darbra"href="http://weibo.com/n/darbra" target="_blank">@darbra</a> 明年继续一起去虹口吧~//<a usercard="肥肉控西奥V热威泽尼"href="http://weibo.com/n/%E8%82%A5%E8%82%89%E6%8E%A7%E8%A5%BF%E5%A5%A5V%E7%83%AD%E5%A8%81%E6%B3%BD%E5%B0%BC" target="_blank">@肥肉控西奥V热威泽尼</a>: <img src="http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/f2/wg_org.gif" title="[围观]" alt="[围观]" type="face" /></em>
					  var re=/<a usercard="(.*?)"(.*?)<em>(.*?)<\/em>/gi;
					  var body_html=document.body.innerHTML;
					  var result=body_html.match(re);
					  for(i=0;i<result.length;i++)
					   {  var re=/<a usercard="(.*?)"(.*?)<em>(.*?)<\/em>/gi;
						 detail=re.exec(result[i]);
						 weibo+="id: "+detail[1]+"\n"+"weibo: "+detail[3]+"\n"+"\n";
						 
					   }
					  
					  return weibo;
						});
					
					 console.log(all_weibos);
				     phantom.exit();
					}
			   
			   }
		 }
    }
   
});