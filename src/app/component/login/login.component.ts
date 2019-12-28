

import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators, NgForm } from '@angular/forms';
import { API_URLS } from 'src/app/core/constants/api-urls';
import * as _ from 'lodash';
import { Router } from '@angular/router';
import { NewsService } from 'src/app/core/services/news.service';
import Keyboard from "simple-keyboard";



@Component({
  selector: 'app-login',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './login.component.html',
  styleUrls: [
    '../../../../node_modules/simple-keyboard/build/css/index.css',
    './login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  userId: String = '';
  password: String = '';
  error = 'User is not Valid.Please enter valid UserId';
  isUserInvalid = false;

  constructor(private fb: FormBuilder, private route: Router,
    public appService: NewsService
  ) { }

  loading3 = false;

  ngOnInit() {



    this.loginForm = this.fb.group({
      'userId': [null, Validators.required],
      'password': [this.value, Validators.required]
    });

    if (!_.isNull(sessionStorage.getItem('userInfo'))) {
      this.route.navigate(['/home']);
    }
    // this.appService.adminPanel.next(false);
  }
  onFormSubmit(form: any) {
    this.loading3 = true;
    if (!_.isEmpty(form)) {
      const path = 'api/access/';
      let body = {
        "email_address": form.userId,
        "password": form.password
      }
      this.appService.loginAPI(body).subscribe((data: any) => {

        console.log(data);
        this.appService.cacheUser.set('userInfo', data);
        sessionStorage.setItem('userInfo', JSON.stringify(data));
        sessionStorage.setItem('accounts_id', JSON.stringify(data.accounts_id));
        this.appService.userName.next(data.user_fname + ' ' + data.user_lname);
        this.appService.notify.next({ id: 'login', value: true });
        if (data.role === 'admin') {
          this.appService.adminPanel.next(true);
        }

        if (data.role === 'customer') {
          this.appService.adminPanel.next(false);
        }
        this.route.navigate(['/home']);
      }, err => {
        this.loading3 = false;
        this.isUserInvalid = true;
        this.loginForm.reset();
      });
    }
    //   let admin = {
    //     "_id": "5dd42958d46b7a6ee4e75697",
    //     "user_fname": "Aguirre",
    //     "user_lname": "Hampton",
    //     "role": "admin",
    //     "accounts_id": "5dd4267ca2c9a04f03489d93",
    //     "mobile_number": "(871) 573-3842",
    //     "email_address": "aguirrehampton@frolix.com",
    //     "secondary_number": "aguirrehampton@frolix.com",
    //     "address": "855 Gunther Place, Lemoyne, Virgin Islands, 6172"
    //   };
    //   if (form.userId === 'admin' && form.password === 'admin') {
    //     this.appService.cacheUser.set('userInfo', admin);
    //     sessionStorage.setItem('userInfo', JSON.stringify(admin));
    //     sessionStorage.setItem('accounts_id', JSON.stringify(admin.accounts_id));
    //     this.appService.notify.next({ id: 'login', value: true });
    //     this.appService.adminPanel.next(true);
    //     this.route.navigate(['/home']);
    //   }

    //   let customer = {
    //     "_id": "5dd42958d46b7a6ee4e7569d",
    //     "user_fname": "Rena",
    //     "user_lname": "Humphrey",
    //     "role": "customer",
    //     "accounts_id": "5dd4267ca2c9a04f03489d93",
    //     "mobile_number": "(870) 439-3330",
    //     "email_address": "renahumphrey@frolix.com",
    //     "secondary_number": "renahumphrey@frolix.com",
    //     "address": "415 Bowne Street, Grill, Tennessee, 6902"
    //   };
    //   if (form.userId === 'customer' && form.password === 'customer') {
    //     this.appService.cacheUser.set('userInfo', customer);
    //     sessionStorage.setItem('userInfo', JSON.stringify(customer));
    //     sessionStorage.setItem('accounts_id', JSON.stringify(customer.accounts_id));
    //     this.appService.notify.next({ id: 'login', value: true });
    //     this.appService.adminPanel.next(false);
    //     this.route.navigate(['/home']);
    //   }
  }

  //keyboard code
  value = "";
  keyboard: Keyboard;

  hideKeyb = false;
  showkEY() {
    this.keyboard = new Keyboard({
      onChange: input => this.onChange(input),
      onKeyPress: button => this.onKeyPress(button)
    });
    this.hideKeyb = true;
  }

  hdekEY() {
    this.hideKeyb = false;
    this.keyboard.destroy();
  }




  onChange = (input: string) => {
    this.value = input;
    this.loginForm.controls['password'].setValue(input);
    console.log("Input changed", input);
  };

  onKeyPress = (button: string) => {
    console.log("Button pressed", button);

    /**
     * If you want to handle the shift and caps lock buttons
     */
    if (button === "{shift}" || button === "{lock}") this.handleShift();
  };

  onInputChange = (event: any) => {
    this.keyboard.setInput(event.target.value);
  };

  handleShift = () => {
    let currentLayout = this.keyboard.options.layoutName;
    let shiftToggle = currentLayout === "default" ? "shift" : "default";

    this.keyboard.setOptions({
      layoutName: shiftToggle
    });
  };
}
