
import re
import os
import time
import urllib2
from shutil import copy
from string import *

patt_go = re.compile(r"go\([\s\S]+?\)", re.I|re.X|re.U)
patt_enter = re.compile(r"enter\([\s\S]+?\)", re.I|re.X|re.U)
patt_fetch = re.compile(r"[\s\S]*?[=]*?fetch\([\s\S]*?\)", re.I|re.X|re.U)
patt_click = re.compile(r"click\([\s\S]*?\)", re.I|re.X|re.U)
patt_prtsc = re.compile(r"prtsc\([\s\S]*?\)", re.I|re.X|re.U)
patt_coord = re.compile(r"[\d]*?,[\d]*?", re.I|re.X|re.U)
patt_sleep = re.compile(r"sleep\([\s\S]+?\)", re.I|re.X|re.U)
patt_set_windowsize =re.compile(r"set_windowsize\([\s\S]+?\)", re.I|re.X|re.U)
patt_exit =re.compile(r"exit\([\s\S]*?\)", re.I|re.X|re.U)

f = open('script.js', 'w') #open for 'w'riting
button_id = []
button_name = []
text_id = []
text_name = []
url=''
url_go=[]
list = []
enter_num=0
click_num=0
page_num =0
windowsize_change = False
url_jump=False

def get_text(url2,num,str):
    list=[]
    a = urllib2.urlopen(url2)
    contents=a.read()
    id_str = "id=\""+str+"\""
    name_str = "name=\""+str+"\""
    class_str = "class=\""+str+"\""
    if str!="null" and str.find('$')!=-1 :
        str=str.strip('$')
        return " return $('"+str+"').val(kw);"
    elif str!="null"  and str.find('$')==-1 :
            return "document.getElementsByClassName('"+str+"')[0].value=kw;"
        
    else:
        inputs=re.findall(r"<input([\s\S]*?)>",contents,re.I)
        for input in inputs:
            if is_text(input)==True:
                list.append(input)
        name = re.findall(r"name=(\"[\s|\S]*?\")",list[num],re.I)
        id = re.findall(r"id=(\"[\s|\S]*?\")",list[num],re.I)
        if len(id)>=1:
            return "document.getElementById("+id[0]+").value=kw;"
     
        elif len(name)>=1:
            return "document.getElementsByName("+name[0]+").value=kw;"

            
def is_text(str):
    flag=False
    if str.find("type=\"text\"")!=-1:flag =True
    elif str.find("password")!=-1:flag=True
    elif str.find("maxlength=")!=-1:flag=True
    elif str.find("account")!=-1:flag=True
    return  flag

def get_button(url,str,num):
    list=[]
    
    id_str = "id=\""+str+"\""
    name_str = "name=\""+str+"\""
    class_str = "class=\""+str+"\""
    if patt_coord.match(str):
        return ''' 
    page.sendEvent('click', '''+str+''');

    '''
    if str.find('$')!=-1 :
        str=str.strip('$')
        if str.find (':contains')!=-1 :
            first_param=re.findall(r"([\s\S]*?):contains",str,re.I)
            last_param = re.findall(r"\(([\s\S]*?)\)",str,re.I)
            return'''var offset = page.evaluate(function() {return $(\''''+str+'''\').html();
  });
if (offset!==null)
{
     var offset = page.evaluate(function() {return $(\''''+str+'''\').offset();
  });
    page.sendEvent('click', offset.left + 1, offset.top + 1);}

else{

              page.evaluate(function() {






  var length = document.getElementsByTagName(\''''+first_param[0]+'''\').length;
                     for (i=0;i<=length;i++)
                     {

                         if (document.getElementsByTagName(\''''+first_param[0]+'''\')[i].innerText ==\''''+last_param[0]+'''\')
                         {

                            var click_this = document.getElementsByTagName(\''''+first_param[0]+'''\')[i];
                                if (document.createEvent)
                            {
                                var evObj = document.createEvent('MouseEvents');
                                evObj.initEvent( 'click', true, false );
                                click_this.dispatchEvent(evObj);
                            }
                            else if (document.createEventObject)
                            {
                                click_this.fireEvent('onclick');
                            }

                             break;
                         }

                     }




  });
}'''

        else:
            return ''' var offset = page.evaluate(function() {return $(\''''+str+'''\').offset();
  });

    page.sendEvent('click', offset.left + 1, offset.top + 1);

    '''
    else:
        a = urllib2.urlopen(url)
        contents=a.read()
        if contents.find(id_str)!= -1:
            line= "document.getElementById(\""+str+"\");"
        elif contents.find(name_str)!= -1:
            line= "document.getElementsByName(\""+str+"\");"
   
        else: 
            inputs=re.findall(r"<input([\s\S]*?)>",contents,re.I)
            for input in inputs:
                if is_button(input,str)==True:
                    list.append(input)
            name = re.findall(r"name=(\"[\s|\S]*?\")",list[num],re.I)
            id = re.findall(r"id=(\"[\s|\S]*?\")",list[num],re.I)
            if len(id)>=1:
                line= "document.getElementById("+id[0]+");"
            elif len(name)>=1:
                line= "document.getElementsByName("+name[0]+");"
        return '''
                page.evaluate(function () {




                            var click_this ='''+line+'''
                            if (document.createEvent)
                            {
                                var evObj = document.createEvent('MouseEvents');
                                evObj.initEvent( 'click', true, false );
                                click_this.dispatchEvent(evObj);
                            }
                            else if (document.createEventObject)
                            {
                                click_this.fireEvent('onclick');
                            }


             return document.URL;

            }//end evaluate


        );
        '''
        

            
def is_button(str,reg):
    flag=False
    if str.find(reg)!=-1:flag =True
    elif str.find("submit")!=-1:flag=True
    return  flag


path = raw_input()
g = open(path, 'r') #open for 'r'eading

for command in g:
    if command .find("end()")!=-1:
        break
        
    else :
        print command
        list.append(command)

g.close()
for command in list:
    if patt_set_windowsize.match(command):
        windowsize_change = True
        param1=re.findall(r"([\d]+?),",command,re.I)
        param2=re.findall(r",([\d]+?)\)",command,re.I)
        x = param1[0]
        y= param2[0]
        f.write(''' var page = require('webpage').create();
         page.viewportSize = { width: '''+x+''', height: '''+y+''' };
          ''')

         
        
    elif patt_go.match(command):
        
        page_num = page_num+1
        enter_num=0
        click_num=0
        param=re.findall(r"go\(([\s\S]+?)\)",command,re.I)
        url_go.append(param[0])
        if page_num>1:
            url=url_go[page_num-1]
            url = url.strip('\"')
            
            f.write('''
                    page.evaluate(function () {

                    window.location.href='''+param[0]+''';




            }//end evaluate


        );
        
                    ''')
        else:
            url=param[0].strip('\"')
            if windowsize_change == True:
                f.write(''' 
             page.open('''+param[0]+''', function (status) {

page.injectJs('jquery-1.6.1.min.js');''')
            else:
                f.write(''' var page = require('webpage').create();
             page.viewportSize = { width: 1366, height: 768 };
             page.open('''+param[0]+''', function (status) {

page.injectJs('jquery-1.6.1.min.js');''')
     
    elif patt_sleep.match(command):
        param=re.findall(r"\(([\d]+?)\)",command,re.I)
        f.write(''' 
               var   start=new   Date().getTime(); 
        while(true)   if(new   Date().getTime()-start>'''+param[0]+ ''')   break; ''')
        
    elif patt_exit.match(command):
        param=re.findall(r"\(([\d]+?)\)",command,re.I)
        if len(param)>=1:
            f.write(''' 
              setTimeout(function(){        phantom.exit()   ;       },'''+param[0]+''');''')
        else:
            f.write(''' 
                phantom.exit()   ;   ''')
        


        
    elif patt_fetch.match(command):
        param=re.findall(r"fetch\(([\s\S]*?)\)",command,re.I)
        if param[0]=="urls":
            if url_jump == False:
                f.write('''
             content = page.evaluate(function () {
                return document.documentElement.outerHTML;


            }

        );
        re=/\\"http:\\/\\/(\\w|\\W)*?\\"/gi;
         urls =content.match(re);

         
        console.log(urls);
       
             ''')
            else:
                 f.write('''
          if (url!=="'''+url+'''/")
            { content = page.evaluate(function () {
                return document.documentElement.outerHTML;


            }

        );
        re=/\\"http:\\/\\/(\\w|\\W)*?\\"/gi;
         urls =content.match(re);
        console.log(urls);}
       
             ''')
        elif param[0]=='':
            if url_jump == False:
                f.write('''
             content = page.evaluate(function () {
                return document.documentElement.outerHTML;


            }

        );
       console.log(content);
            ''')    
            else:
                 f.write('''
             if (url!=="'''+url+'''/")
             {content = page.evaluate(function () {
                return document.documentElement.outerHTML;


            }

        );
       console.log(content);}
            ''')

        #compile_fetch(param[0])
        
    elif patt_enter.match(command):
        if command.find(',')!= -1:
            
        ##temp=re.findall(r"enter\(([\s\S]+?)\)",command,re.I)
            param_1=re.findall(r"enter\(([\s\S]+?),",command,re.I)
            param_2=re.findall(r",([\s\S]+)\)",command,re.I)
            
            str=get_text(url,enter_num,param_2[0])
            
            
        else:
            param_1=re.findall(r"enter\(([\s\S]+?)\)",command,re.I)
            str=get_text(url,enter_num,"null")
        
        
        enter_num=enter_num+1
        line = '''
page.evaluate(function () {

                            kw = "'''+param_1[0]+'''";'''+str+'''




            }


        );


'''
    
        f.write(line)
        #compile_enter(param[0])
        
    elif patt_click.match(command):
       ## url_jump =True
        param=re.findall(r"click\(([\s\S]*)\)",command,re.I)
        line = get_button(url,param[0],click_num)
        click_num=click_num+1
        f.write(line)
        
      
    elif patt_prtsc.match(command):
       
        f.write('''
url = page.evaluate(function () {
                return document.URL;


            }

        );

     console.log(url);
url1 = url.replace(/\W/gi,'_');
                 path =   'C:\\\output'+'\\\\'+url1+'.png';


                  //  window.setTimeout(function(){        page.render(path);          }, 4000);
                   page.render(path); 
''')

       
    else:
        if command !='end':
            f.write(command)
f.write('''
    })''')    
f.close()
os.system('start cmd.exe cmd/k C:\Users\lenovo\Desktop\git\phantomjs-1.4.1-win32-dynamic\phantomjs --script-encoding=GBK --output-encoding=GBK script.js  ')


