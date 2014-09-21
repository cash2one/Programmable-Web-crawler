var num=0;
var page = new WebPage(),
    url = 'http://www.weibo.com';

var user_name;
var password;
var weibo;
if(phantom.args.length==3)
     {
	  var arg_email=phantom.args[0];
	  var arg_password=phantom.args[1];
	  var arg_weibo=phantom.args[2];
	  var re_email=/^-u(.+?)$/gi;
	  var re_password=/^-p(.+?)$/gi;
	  var re_weibo=/^-d(.+?)$/gi;
	  var result_email=re_email.exec(arg_email);
	  var result_password=re_password.exec(arg_password);
	  var result_weibo=re_weibo.exec(arg_weibo);
	  if(result_email==null||result_password==null||result_weibo==null)
		  {
		   console.log('unclear agruments format');
		   console.log('-u: username/email\n-p: password \n-d: detail');
		   console.log('eg: phantomjs -ucxf -p123 -d123');
		   phantom.exit();
		  }
	  user_name=result_email[1];
	  password=result_password[1];
	  weibo=result_weibo[1];
	  console.log(weibo);
	  
	 
	 }
  else 
    {
	 console.log('unclear agruments format');
     console.log('-u: username/email\n-p: password \n-d: detail');
     console.log('eg: phantomjs -ucxf -p123 -d123');
     phantom.exit();
	}
	

page.open(url, function (status) {
    if (status !== 'success') {
        console.log('Unable to access network');
    } 
	else
	{ 
	  var ur=page.evaluate(function(){ return document.URL;});
	  console.log("url"+ur+"num:"+num);
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
				num++;
			}
			
	   else 
		   {         
						//send_succpic
						
                    eval("function fn()\
					{ setTimeout(function(){\
					var input_box=document.getElementsByTagName('textarea')[0];\
						 input_box.focus();\
						 input_box.value='"+weibo+"';\
						 input_box.focus();\
						 var submit_weibo;\
						 var all = document.getElementsByTagName('a');\
						 for (var e = 0; e < all.length; e++) \
						  { \
							if (all[e].title == '发布微博按钮')\
 							 {\
							   submit_weibo= all[e];\
							    break;\
							 }\
						  }\
						 \
						 if (document.createEvent)\
							  {\
								var evObj = document.createEvent('MouseEvents');\
								evObj.initEvent( 'click', true, false );\
								submit_weibo.dispatchEvent(evObj);\
								submit_weibo.dispatchEvent(evObj);\
							  }\
						 else if (document.createEventObject)\
							  {\
								   submit_weibo.fireEvent('onclick');\
								   submit_weibo.fireEvent('onclick');\
							  }\
							  },1000);\
					}");    
					page.evaluate(fn);
					//setTimeout(function(){phantom.exit();},2000);
					//phantom.exit();
						//  var weibo=page.evaluate(function(){return document.URL;});
	                     // console.log(url);
						// console.log(document.URL);
						//console.log(res);
						
				
		  
		   }
       
    }
   
});