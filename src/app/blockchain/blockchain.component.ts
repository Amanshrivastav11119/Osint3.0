import { Component } from '@angular/core';
import { BlockchainService } from '../service/blockchain.service';

interface BalanceResult {
  final_balance: number;
  n_tx: number;
  total_received: number;
}

interface AddressInfo {
  address: string;
  final_balance: number;
  n_tx: number;
  total_received: number;
}

interface TransactionInfo {
  txid: string;
  // Add more properties as needed
}

interface GeneralInfo {
  nconnected: number;
  conversion: number;
  // Add more properties as needed
}

interface MultipleAddressResult {
  addresses: AddressInfo[];
  wallet: BalanceResult;
  txs: TransactionInfo[];
  info: GeneralInfo;
  recommend_include_fee: boolean;
}

@Component({
  selector: 'app-blockchain',
  templateUrl: './blockchain.component.html',
  styleUrls: ['./blockchain.component.css']
})
export class BlockchainComponent {

  userInput: string;
  selectedFunction: string = "Select Option";
  searchResult: undefined | MultipleAddressResult | any;

  // Search placeholder functions
  isFocused: boolean = false;
  onFocus() {
    this.isFocused = true;
  }
  onBlur() {
    this.isFocused = false;
  }

  constructor(private blockchainService: BlockchainService) { }

  search(): void {
    switch (this.selectedFunction) {
      case 'Multiple Address':
        this.getMultiaddr(this.userInput);
        break;
      case 'Single Address':
        this.getRawaddr(this.userInput);
        break;
      case 'Single Transaction':
        this.getRawtx(this.userInput);
        break;
      case 'Single Block':
        this.getRawblock(this.userInput);
        break;
      default:
        // console.error('Invalid function selected');
    }
  }

  selectFunction(selectedFunction: string) {
    this.selectedFunction = selectedFunction;
    this.searchResult = undefined; 
  }

  getMultiaddr(active: string): void {
    this.blockchainService.getMultiaddr(active).subscribe((result: MultipleAddressResult) => this.searchResult = result);
    // console.log(this.searchResult);
  }

  getRawaddr(address: string): void {
    this.blockchainService.getRawaddr(address).subscribe(result => this.searchResult = result);
    // console.log(this.searchResult);
  }

  getRawtx(txid: string): void {
    this.blockchainService.getRawtx(txid).subscribe(result => this.searchResult = result);
    // console.log(this.searchResult);
  }

  getRawblock(blockhash: string): void {
    this.blockchainService.getRawblock(blockhash).subscribe(result => this.searchResult = result);
    // console.log(this.searchResult);
  }

}
