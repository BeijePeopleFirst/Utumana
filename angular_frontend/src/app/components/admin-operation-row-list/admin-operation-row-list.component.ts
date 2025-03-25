import { Component, OnInit } from '@angular/core';
import { PopularOperation, PopularOperationTitle } from 'src/app/models/popularOperation';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-admin-operation-row-list',
  templateUrl: './admin-operation-row-list.component.html',
  styleUrls: ['./admin-operation-row-list.component.css']
})
export class AdminOperationRowListComponent implements OnInit {

  
  user!: User;
  operations: [PopularOperationTitle, PopularOperationTitle | null, PopularOperationTitle | null] = [PopularOperationTitle.HOME, null, null];

  latestOperation!: PopularOperationTitle | null | undefined;

  thereAreNoOperations: boolean = false;
  thereIsNoLatestOperation: boolean = false;

  //MESSAGES:
  //---------------------------------------------
  public thereAreMessages: boolean = false;
  public errorFetchingUser: boolean = false;
  public errorFetchingUserOperations: boolean = false;
  //---------------------------------------------


  constructor(
    private userService: UserService
  )
  {}


  ngOnInit(): void {

    this.userService.getUserById(Number(localStorage.getItem("id"))).subscribe(
      data => {

        if("message" in data) {
          console.error(data);
          this.thereAreMessages = true;
          this.errorFetchingUser = true;
          return;
        }

        this.user = data;

        if(this.user.latest_admin_operation) this.latestOperation = this.user.latest_admin_operation.title;
        else this.thereIsNoLatestOperation = true;

        this.userService.getUserAdminOperationsCount(this.user.id!).subscribe(
          ops => {
            if("message" in ops) {
              console.error(ops);
              this.thereAreMessages = true;
              this.errorFetchingUserOperations = true;
              return;
            }

            ops.sort((a, b) => b.counter - a.counter);

            if(ops.length >= 3) {
              this.operations[0] = ops[0].title;
              this.operations[1] = ops[1].title;
              this.operations[2] = ops[2].title;
              
            }
            else if(ops.length === 2) {
              this.operations[0] = ops[0].title;
              this.operations[1] = ops[1].title;
              this.operations[2] = null;

            }
            else if(ops.length === 1) {
              this.operations[0] = ops[0].title;
              this.operations[1] = null;
              this.operations[2] = null;

            }
            else {
              this.thereAreNoOperations = true;
            }

            console.log("operations -> ", this.operations);
          }
        )
      }
    )
    
  }

  public clearMessages(): void {
    this.thereAreMessages = false;
    this.errorFetchingUser = false;
    this.errorFetchingUserOperations = false;
  }


}
