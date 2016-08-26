---
layout: default
title: Glǽmscribe
---

<style>
.main_title {
    text-align:center;
    margin-top:30px;
    margin-bottom:60px;

}
.main_title h1     {    
    margin-top:20px;
        font-size: 50px;
        margin-bottom:0px;
        line-height:1;
           font-weight:bold; 
    }
.main_title .subtitle {
        color:#999999;
        margin-left: 150px;
           font-size: 20px;
           font-weight: lighter;
}

.username {
  margin-left:3px;
}

li:before {
	content:'\0FD4';
	font-family: kailasigns;
	margin:0;
	margin-right:10px;	
	font-size:1.1em;
	line-height:0;
    
}
h2:before {
	content:'\0F04';
	font-family: kailasigns;
	margin:0;
	margin-right:10px;	
	line-height:0;   
}
h3:before {
	content:'\0FD3';
	font-family: kailasigns;
	margin:0;
    margin-right: 7px;
    vertical-align: -1px;
	line-height:0;   
}
/*
h4:before {
	content:'\0FD4';
	font-family: kailasigns;
	margin:0;
    margin-right: 7px;
    vertical-align: -1px;
	line-height:0;   
}
*/


li {
    list-style-type:none;
}
h2 {
    font-size:30px;
    font-weight:bold;
 
    margin-bottom:10px;
}
h3 {
    font-weight: bold;
    font-size:22px;
    margin-top:0px;
    margin-bottom:5px;
}
h4 {
  margin-bottom:4px;
  font-weight:bold;
}
hr {
    border-color: #C3C3C3;
    border-width: 1px 0px 0px 0px;
    border-collapse: collapse;
    /* background-color: white; */
    border-style: solid;
    margin-top: 25px;
    margin-bottom: 20px;
}
</style>

<div class="main_title">
    <h1>Glǽmscribe</h1>
    <div class="subtitle"><i>{{ site.long_subtitle }}</i></div>   
</div>

This is the **_Developer Website_** for [**_Glǽmscribe_**](http://jrrvf.com/~glaemscrafu/english/glaemscribe.html). 

Its purpose is to centralize all the pieces of documentation for all those who want to use <i>Glǽmscribe's engine</i> **outside** of its official web integration, mainly by integrating it or using it as a command line tool. 

<div style="    background-color: #F6F6FF;
    padding: 10px;
    border-radius: 5px;
    border: solid 1px #C7C7C7;
    margin:10px 0px 10px 20px;
    display:inline-block">
<ul style="padding: 0px;
    margin: 0px 10px 0px 10px;">
    <li><a href="#about">What is Glǽmscribe ?</a></li>
    <li><a href="#install">Installation</a></li>
    <li><a href="#integrate">Integration</a></li>
    <li><a href="#about_fonts">About fonts</a></li>
    <li><a href="#clt">Command line tool</a></li>
    <li><a href="#mode_dev">Mode development</a></li>
    <li><a href="#license">License</a></li>
</ul>
</div>
<hr>

<a name="about"></a>

What is Glǽmscribe ?
--------------------

{{ site.long_description }} It has been conceived and developed by *Benjamin Babut (Talagan)*.

The [**_official integration of Glǽmscribe's engine_**](http://jrrvf.com/~glaemscrafu/english/glaemscribe.html) is hosted on the [**_Glǽmscrafu_**](http://jrrvf.com/~glaemscrafu) website. It is a complete online transcription tool built on top of the open source engine. 

<hr>

<a name="install"></a>

Installation
------------

The *Glǽmscribe* engine has currently two implementations : a **ruby** one and a **javascript** one.

### Ruby 

*Glǽmscribe* is released as a gem, so you can either install it in your current ruby installation with

    gem install glaemscribe
   
Or, alternatively, if in a project that uses **bundle**, edit your **Gemfile**, add the **glaemscribe** gem and run _bundle install_. 

### Javascript

*Glǽmscribe* comes as a standalone library. You can download the latest version <a href="https://github.com/BenTalagan/glaemscribe/tree/master/build/web/glaemscribe/js">here</a>. You can either use **glaemscribe.js** or **glaemscribe.min.js** depending on your environment. 

Simply add it to your web pages as you would do with a standard **js** library.

<hr>

<a name="integrate"></a>

Integration
-----------

### Ruby 

#### Require glaemscribe

{% highlight ruby %}
require 'glaemscribe' # Optional if used with bundler
{% endhighlight %}

#### Load modes

{% highlight ruby %}
# Load ALL shipped modes
Glaemscribe::API::ResourceManager::load_modes 

# Load only several modes
Glaemscribe::API::ResourceManager::load_modes("quenya")
Glaemscribe::API::ResourceManager::load_modes(["quenya","sindarin"])
{% endhighlight %}

#### Transcribe some text

{% highlight ruby %}
# Access loaded modes
quenya = Glaemscribe::API::ResourceManager::loaded_modes["quenya"]

# Use a mode
quenya.transcribe("Ai ! Laurie lantar lassi súrinen !")
# Will give the transcription in the default charset of the quenya mode, 
# 'ds_based', which corresponds to the common charset of the fonts based 
# on the old fonts designed by Dan Smith
 => [true, "lE Á j.E7T`V jE4#6 jE,T 8~M7T5$5 Á"]

# Slightly change the behaviour by using options defined by the mode
quenya.finalize(always_use_romen_for_r: true)
quenya.transcribe("Ai ! Laurie lantar lassi súrinen !")
 => [true, "lE Á j.E7T`V jE4#7 jE,T 8~M7T5$5 Á"]
 
# Use an alternative charset for better rendering, depending on the font 
# you want to use
tengwar_eldamar_charset = Glaemscribe::API::ResourceManager::loaded_charsets["tengwar_ds_eldamar"]

quenya.transcribe("Ai ! Laurie lantar lassi súrinen !", tengwar_eldamar_charset)
 => [true, "lD Á j.E7T`V jE4#6 jE,G 8~M7T5$5 Á"]
 
{% endhighlight %}

#### Get mode options info

{% highlight ruby %}
# Get a list of options proposed by the mode
quenya.options
 => {
  always_use_romen_for_r: {
    name: "always_use_romen_for_r",
    type: "BOOL",
    default_value_name: "false"
  },
  reverse_numbers: {
    name: "reverse_numbers",
    type: "BOOL",
    default_value_name: "true"
  },
  split_diphthongs: {
    name: "split_diphthongs",
    type: "BOOL",
    default_value_name: "false"
  },
  numbers_base: {
    name: "numbers_base",
    type: "ENUM",
    default_value_name: "BASE_12",
    values: {
      BASE_10: 10,
      BASE_12: 12
    }
  }
}
 
 
{% endhighlight %}

### Javascript

#### Include glaemscribe

{% highlight javascript %}  
// Include glaemscribe engine (you can use .min.js or plain .js version)
<script src="../glaemscribe/js/glaemscribe.min.js"/>	

// Include the charsets you need
<script src="../glaemscribe/js/charsets/tengwar_ds.cst.js"/>	
<script src="../glaemscribe/js/charsets/cirth_ds.cst.js"/>	

// Include the modes you need
<script src="../glaemscribe/js/modes/khuzdul.glaem.js"/>	
<script src="../glaemscribe/js/modes/quenya.glaem.js"/>	
<script src="../glaemscribe/js/modes/sindarin-beleriand.glaem.js"/>	
<script src="../glaemscribe/js/modes/sindarin-classical.glaem.js"/>	
{% endhighlight %}
   
#### Load modes   
   
{% highlight javascript %}     
// Load all the included modes
Glaemscribe.resource_manager.load_modes()
// Or load only several ones
Glaemscribe.resource_manager.load_modes("quenya")
Glaemscribe.resource_manager.load_modes(["quenya","sindarin-beleriand"])
{% endhighlight %}
   
#### Transcribe some text   
   
{% highlight javascript %} 
// Access loaded modes
var quenya = Glaemscribe.resource_manager.loaded_modes["quenya"]

// Use a mode
quenya.transcribe("Ai ! Laurie lantar lassi súrinen !")
// Will give the transcription in the default charset of the quenya mode, 
// 'ds_based', which corresponds to the common charset of the fonts based 
// on the old fonts designed by Dan Smith
 => [true, "lE Á j.E7T`V jE4#6 jE,T 8~M7T5$5 Á"]
  
// Slightly change the behaviour by using options defined by the mode
quenya.finalize( { always_use_romen_for_r: true } )
quenya.transcribe("Ai ! Laurie lantar lassi súrinen !")
 => [true, "lE Á j.E7T`V jE4#7 jE,T 8~M7T5$5 Á"]
 
// Use an alternative charset for better rendering, depending on the font 
// you want to use
var tengwar_eldamar_charset = Glaemscribe.resource_manager.loaded_charsets["tengwar_ds_eldamar"]

quenya.transcribe("Ai ! Laurie lantar lassi súrinen !", tengwar_eldamar_charset)
 => [true, "lD Á j.E7T`V jE4#6 jE,G 8~M7T5$5 Á"] 
{% endhighlight %}

#### Get mode options info

{% highlight javascript %}
// Get a list of options proposed by the mode
quenya.options
 => {
  always_use_romen_for_r: {
    name: "always_use_romen_for_r",
    type: "BOOL",
    default_value_name: "false"
  },
  reverse_numbers: {
    name: "reverse_numbers",
    type: "BOOL",
    default_value_name: "true"
  },
  split_diphthongs: {
    name: "split_diphthongs",
    type: "BOOL",
    default_value_name: "false"
  },
  numbers_base: {
    name: "numbers_base",
    type: "ENUM",
    default_value_name: "BASE_12",
    values: {
      BASE_10: 10,
      BASE_12: 12
    }
  }
}

{% endhighlight %}

<hr>


<a name="about_fonts"></a>

About Fonts
-----------

Font integration, particularily webfont integration, is of your responsability. We do not own or are the authors of any font dedicated to the transcription of Tolkien languages and writing systems.

Still, you can find [**_there on Glǽmscrafu_**](http://jrrvf.com/~glaemscrafu/english/about-transcriptions.html) a few of the fonts we slightly modified to make them work with the distributed official modes for Glǽmscribe.

<hr>

<a name="clt"></a>

Using the command line tool
---------------------------

{% highlight text %}
 glaemscribe help 

  NAME:

    glaemscribe

  DESCRIPTION:

    Glǽmscribe (also written Glaemscribe) is a software dedicated to the
    transcription of texts between writing systems, and more specifically
    dedicated to the transcription of J.R.R. Tolkien's invented languages 
    to some of his devised writing systems.

  COMMANDS:
        
    help       Display global or [command] help documentation           
    info       Displays information about an embedded mode              
    list       Lists all available embedded modes               
    transcribe Transcribes a file (default command)     

  GLOBAL OPTIONS:
        
    -h, --help 
        Display help documentation
        
    -v, --version 
        Display version information
        
    -t, --trace 
        Display backtrace when an error occurs
          
  AUTHOR:

    Benjamin Talagan Babut
{% endhighlight %}

{% highlight text %}
glaemscribe help transcribe

  NAME:

    transcribe

  SYNOPSIS:

    glaemscribe transcribe file [options]

  DESCRIPTION:

    Transcribes a file with the given options. You can use '-' instead of a file name to work with stdin.

  OPTIONS:
        
    -m, --mode mode 
        The name of the embedded mode to use. See the 'list' command to get a list of available modes names.
        
    -c, --charset charset 
        The name of the charset to use. If not given, glaemscribe will load and use the default charset defined in the mode.
        
    --modefile modefile 
        Use a custom mode file instead of an embedded one. The file extension must be .glaem .
        
    --charsetfile charsetfile 
        Use a custom charset file instead of an embedded one. The file extension must be .cst .
        
    -o, --options name1:value1,name2:value2,... 
        Pass options to the transcriptor (see the mode options documentation).
{% endhighlight %}

<hr>

<a name="mode_dev"></a>

Mode development
----------------

If you're interested in developing modes for Glǽmscribe, please check the official [*mode authoring documentation* on Glǽmscrafu]({{ site.glaemscribe_mode_documentation_url }}). We have chosen to separate that specific part of the documentation because we have considered that it deals with matters of *usage development* rather than *integration development* stricto sensu. 

<hr>

<a name="license"></a>

License
-------

Glǽmscribe is released under the terms of the GNU Affero General Public License :

    Glǽmscribe (also written Glaemscribe) is a software dedicated to
    the transcription of texts between writing systems, and more 
    specifically dedicated to the transcription of J.R.R. Tolkien's 
    invented languages to some of his devised writing systems.
    
    Copyright (C) 2015 Benjamin Babut (Talagan).
    
    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    any later version.
    
    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.
    
    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.


