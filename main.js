//we will have 5 components - home,tips-format,tips,about and contact

//This is our home component where our generator will be stored in

Vue.component('home', {
  template: `<!-- This is our home component, we have used grids and fonts from bootstrap to help set it up -->
    
    <div class="container col-xl-8 offset-xl-2 py-5">
        <h1 class="display-4 font-weight-light mt-4 text-white text-center">Welcome to PasswdGen</h1>
        <p class="lead text-white-50 text-center">The all new password generator for your security! </p>
        
    <!-- This is where the password generator will be placed inside our home component. It uses checkboxes from the pretty-checkboxes external library-->

  <section id="passwordGeneratorSection" class ="text-center">
    <h2 class="text-center">PasswdGen</h2>
      
      <p class="lead text-10">Choose your criteria, select a length and hit the generate button.</p><br><br>
    <div class="controls">
        
        <!-- This is a checkbox created that has v-model(form input bindings) of the variable simple-->
        
        <div class="pretty p-icon p-default p-pulse">
          <input v-model="simple" type="checkbox">
          <div class="state p-primary"><label><strong>Add Simple Letters(a-z)&nbsp</strong></label></div>
        </div><br><br><br>
        
        <!-- This is a checkbox created that has v-model(form input bindings) of the variable capital-->
        
        <div class="pretty p-icon p-default p-pulse">
          <input v-model="capital" type="checkbox">
          <div class="state p-primary"><label><strong>Add Capital Letters(A-Z)</strong></label></div>
        </div><br><br><br>
        
        <!-- This is a checkbox created that has v-model(form input bindings) of the variable numbers-->
        
        <div class="pretty p-icon p-default p-pulse">
          <input v-model="numbers" type="checkbox">
          <div class="state p-primary"><label><strong>Add Numbers(1-9)&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp</strong></label></div>
        </div><br><br><br>
        
        <!-- This is a checkbox created that has v-model(form input bindings) of the variable chars-->
         <div class="pretty p-icon p-default p-pulse">
             
          <input v-model="chars" type="checkbox">
          <div class="state p-primary"><label><strong>Add Special Characters&nbsp&nbsp</strong></label></div>
        </div><br><br><br>
        <div class="col-xs-12 form-group">
          <label for="len" class="col-xs-4 control-label">Choose the length of Password</label><br><br>
            <div class="col-xs-7">
                
                <!-- This is a slider created that has v-model(form input bindings) of the varibale len-->
                
            <input class="form-control-range" type="range" id="len" v-model="len" min="2" max="50" value="8" step="1">
          </div>
          <div class="col-xs-1 text-center">{{len}}</div><br>
        </div>
        <div class="form-group col-xs-8">
            
          <!-- The generate password button and the copy password button where we use on:click(event handling) to direct them to generatepassword and copy functions -->

          <button class="btn btn-primary" @click="generatePassword" >Generate password</button>
          <button class="btn btn-primary" v-on:click="copyPassword" >Copy Password</button><br><br>
                  
          <!-- Here we use conditional rendering (v-if) to display that the password is copied when the data copied is true-->
            
          <div v-if="copied">Password copied successfuly!</div>
      </div>
    </div>
      
      <!-- This is the password box that we have created and styled in CSS where the password that is generated will be displayed using interpolations-->
      
      <div id="password-box">
        <span id="password-text">{{ generatedPassword }}</span>
      </div>
    </section>
       <div>
           
    <!--This is for the social media sharing option-->
        
    <h4 class="text-white text-center">Share it with your friends</h4><br>
    <ul class="share-buttons text-center">
      <li class ="animate-icon"><a href="https://www.facebook.com/sharer/sharer.php?u=&quote=" title="Share on Facebook" target="_blank"><img alt="Share on Facebook" src="img/Facebook.png" /></a></li>
      <li class ="animate-icon"><a href="https://twitter.com/intent/tweet?source=&text=:%20" target="_blank" title="Tweet"><img alt="Tweet" src="img/twitter.png" /></a></li>
      <li class ="animate-icon"><a href="https://plus.google.com/share?url=" target="_blank" title="Share on Google+"><img alt="Share on Google+" src="img/Google+.png" /></a></li>
      <li class ="animate-icon"><a href="http://pinterest.com/pin/create/button/?url=&description=" target="_blank" title="Pin it"><img alt="Pin it" src="img/Pinterest.png" /></a></li>
      <li class ="animate-icon"><a href="http://www.linkedin.com/shareArticle?mini=true&url=&title=&summary=&source=" target="_blank" title="Share on LinkedIn"><img alt="Share on LinkedIn" src="img/LinkedIn.png" /></a></li>
    </ul>
    </div>
    </div>`,
    
    //make a function of the data called data to return the data we use
    data: function data() {
    return {
      simple: true,
      capital: true,
      numbers: false,
      chars: false,
      len: 8,
      generatedPassword: '',
      copied: false,
    };
  },
    
    methods: {
        
      //this is our copy function that lets us copy the generated password
     copyPassword: function copyPassword(){      
      // creating a text area, then putting the password inside it
      var copyElement = document.createElement("textarea");
      copyElement.style.opacity = '0';
      copyElement.style.position = 'fixed';
      copyElement.textContent = this.generatedPassword;
      //copying the password
      var body = document.getElementsByTagName('body')[0];
      body.appendChild(copyElement);
      copyElement.select();
      document.execCommand('copy');
      body.removeChild(copyElement);
      //make copied = true so that we can use v-if "copied" on the template when the password has been copied
      this.copied = true;
      //make copied = false after a timer so that text dissapears after showing in the html when using v-if
      setTimeout(() => {
        this.copied = false;
      }, 750);
    },
        
    generatePassword: function generatePassword() {
      //putting "ticked" value as true to the selected criteria or false to the unselected criteria
      // in each object randomfn contains the function which will call a function to generate random letter, number or special character
      var checked = [
          { name: 'simple', ticked: this.simple, randomfn: this.randomSimpleLetter },
          { name: 'capital', ticked: this.capital, randomfn: this.randomCapitalLetter },
          { name: 'numbers', ticked: this.numbers, randomfn: this.randomNumber },
          { name: 'chars', ticked: this.chars, randomfn: this.randomSpecialChar }]
      //this filters the criteria created above to return only those criteria which were selected to generate password
      // so "checked" array will only contains the criteria that are checked on UI
      .filter(function (tick) {
        return tick.ticked;
      });

      var cLen = checked.length;

      //making generatedPassword variable an array to store the password character one by one by depending upon the length of password randomly between the ticked criterias e.g simple, capital , numbers, chars from "checked" array of objects
      this.generatedPassword = [];

      // if no criteria is choosen throw an error and stop here.
      if (!cLen) {
        alert('Please Select Atleast One Option!');
        return;
      }

      // looping the times the length is choosen for the password
      for (var i = 0; i < this.len; i++) {
     
        // picking randomly between the criteria from "checked" array of object everytime when we are looping 
        // e.g when i = 1, we choose randomly between the ticked criterias to put at position 1 in password string
        // similarly we do it the times the password length is
          
        var r = this.randomRange(0, cLen - 1);
          
        // the criteria choosen randomly above & stored in "r" variable is then used to generate the value
        // e.g if simple, capital were ticked & "r" picked randomly "simple" criteria to genreate value 
        // then then we are picking the random simple alphabet using checked[r].randomfn().
        // The variable 'r' decides which criteria to pick from "checked" array
        this.generatedPassword.push(checked[r].randomfn());
      }

      // the seprate generatedPassword array of length defined by the user is then combined to create a string
      // of length choosen by the user.
      this.generatedPassword = this.generatedPassword.join('');
    },
        
     //algorithm to get random values inside the function
    randomRange: function randomRange() {
      var min = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      var max = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 10;
      return Math.floor(Math.random() * (max - min + 1)) + min;
    },
        
    randomSimpleLetter: function randomSimpleLetter() {
      // pick the random value from 97 to 122(Unicode of 97-122 is a-z)
      var num = this.randomRange(97, 122);
      // Converting a Unicode number stored in "num" variable into a characted using fromCharCode inbuilt function
      return String.fromCharCode(num);
    },
        
    randomCapitalLetter: function randomCapitalLetter() {
      // pick the random value from 65 to 90(Unicode of 65-90 is A-Z)
      var num = this.randomRange(65, 90);
      // Converting a Unicode number stored in "num" variable into a characted using fromCharCode inbuilt function
      return String.fromCharCode(num);
    },
        
    randomNumber: function randomNumber() {
      // pick the random value from 48 to 57(unicode of 48-57 is 1-9)
      var num = this.randomRange(48, 57);
      // Converting a Unicode number stored in "num" variable into a character using fromCharCode inbuilt function
      return String.fromCharCode(num);
    },
        
    randomSpecialChar: function randomSpecialChar() {
      // defining array of objects where each object contains the min to max unicode value that represents the special character
      var ranges = [
          { min: 33, max: 47 },
          { min: 58, max: 64 }, 
          { min: 91, max: 96 }, 
          { min: 123, max: 126 }];
      
      // picking randomly an object from "ranges" array above to generate the special character from
      var range = this.randomRange(0, 3);
      var min = ranges[range].min; // getting min value of selected object from "ranges" array
      var max = ranges[range].max; // getting max value of selected object from "ranges" array
      // using selected object's min and max to selected the unicode value
      // e.g if first object is choosen then min 33 max 47. "num" will contain value between 33-47
      var num = this.randomRange(min, max);

      // generating the character from unicode stored in "num" variable
      return String.fromCharCode(num);
    }
      
  }
});

//this is our tips-format component where we will use props to pass it to the tips component(tips title and tips content)

Vue.component('tips-format', {
  props: ['tipsTitle', 'tipsContent'],
  template: `<div><h4 class="text-white">{{ tipsTitle }}</h4>
        <p class="text-white lead">{{ tipsContent }}</p><br></div>`
})


//this is our tips component where we will display the props passed by the tips-format component and give it values so we use <tips-format> and give values to tips-title and tips-content

Vue.component('tips', {
  template: `<div class="col-xl-8 offset-xl-2 py-5 text-left">
            
        <h1 class="display-4 font-weight-light mt-4 text-white">Tips for Security</h1>
        <p class="lead text-white-50">Some Tips for your security and privacy online</p><br>
            
        <tips-format tips-title="Same Password for multiple accounts" tips-content="Do not use the same password for multiple accounts that are important"></tips-format>
            
        <tips-format tips-title="Known names in passwords" tips-content="Do not use the names of your families, friends or pets in your passwords"></tips-format>
            
        <tips-format tips-title="Recommended password size" tips-content="Use a password that has at least 16 characters, use at least one number, one uppercase letter, one lowercase letter and one special symbol"></tips-format>
            
        <tips-format tips-title="When to change passwords" tips-content="It's recommended to change your passwords every 10 weeks"></tips-format>
            
        <tips-format tips-title="Enabling 2-factor authentication" tips-content="It's recommended to turn on 2-factor authentication whenever possible"></tips-format>
            
        <tips-format tips-title="Saving Password in browsers" tips-content="Do not let your web browsers to store your passwords, since all passwords saved in web browsers can be revealed easily"></tips-format>
            
        <tips-format tips-title="Logging into accounts when using other networks" tips-content="Do not log in to important accounts on the computers of others, or when connected to a public Wi-Fi hotspot, free VPN or web proxy."></tips-format>

        </div>
`
})

//this is our about component 

Vue.component('about', {
  template: `<div class="col-xl-8 offset-xl-2 py-5 text-left">  
            <h1 class="display-4 font-weight-light mt-4 text-white">About Us</h1>
            <p class="lead text-white-50">Here's some information about us</p><br>
            <p class="lead text-white">PasswdGen is built to be a responsive and progressive web app that lets users who are concerned about security to generate a strong password. <br><br>It is free to use and you can generate a password for your accounts to keep you safe from hackers and increase your online and offline security.</p><br>
            <p class="text-white lead">You can also view some tips to help you increase your security from our website!</p>
            <p class="text-white lead">Thank you for visiting us and we hope that you stay safe and secure!</p>
            </div> `
})

//this is our contact component where there is template and inside the template is a form made by html with the help of bootstrap so it is responsive

Vue.component('contact', {
  template: `  <div class="contact">
            
        <div class="col-xl-8 offset-xl-2 py-5">
        
          <h3 class="display-4 font-weight-light mt-4 text-white">Contact Us</h3>
          <p class="lead text-white-50">Contact us to know more about the generator or request us to add more features!</p><br>

          <form id="contact-form">
          <div class="controls">

          <div class="row"> 
            <div class="col-md-6">
                <div class="form-group">
                <label class="text-white">First Name</label>
                <input  type="text" class="form-control" placeholder="Your First Name" required="required" data-error="First Name is required.">
                </div>
            </div>
                    
            <div class="col-md-6">
                <div class="form-group">
                <label class="text-white">Last Name</label>
                <input type="text"  class="form-control" placeholder="Your Last Name" required="required" data-error="Last Name is required.">
                </div>
            </div>
            </div>
                
            <div class="row">
              <div class="col-md-6">
                <div class="form-group">
                <label for="form_email" class="text-white">Email Address</label>
                <input type="email"  class="form-control" placeholder="Your Email Address" required="required" data-error="Valid email is required.">
                </div>
              </div>
                            
              <div class="col-md-6">
                <div class="form-group">
                <label class="text-white">Purpose of Contact</label>
                <select name="need" class="form-control" required="required" data-error="Please specify your purpose">
                    <option value="Request quotation">General Inquiry</option>
                    <option value="Request order status">Request us to add more features</option>
                    <option value="Other">Other</option>
                </select>
                </div>
              </div>
            </div>
                        
            <div class="row">
              <div class="col-md-12">
                <div class="form-group">
                <label class="text-white">Message</label>
                <textarea name="message" class="form-control" placeholder="Your Message" rows="5" required="required" data-error="Please enter your message"></textarea>
                </div>
               </div>
                            
              <div class="col-md-12" id="send-button">
                <input type="submit" class="btn-lg btn-light btn-send" value="Send message">
              </div>
            </div>
            </div>
            </form>
          </div>
        </div>`
})


//our vue instance to run the navbar and all other components dynamically 
new Vue({
  el: '#navbar',
  data: {
  currentView: 'home',
  }
})





