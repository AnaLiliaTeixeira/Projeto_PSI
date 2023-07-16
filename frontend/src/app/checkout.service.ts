import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class CheckoutService {

  constructor() { }

  processPayment(): boolean {
    // Simulate 50% chance of success
    const isSuccess = Math.random() < 0.5;
    return isSuccess;
  }
  
}
