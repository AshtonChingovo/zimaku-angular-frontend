import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { APIResponse } from '../../../authentication/model/api-response.model';
import { UsersService } from '../users.service';
import { Pagination as PaginationService } from '../../../util/pagination.service';
import { PaginationAPIResponseModel as PaginationResponseModel } from '../../../model/pagination-response.model';
import { UserModel } from '../../model/user.model';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [ CommonModule ],
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.css'
})
export class UsersListComponent implements OnInit {

  apiResponse: APIResponse
  paginationResponseModel: PaginationResponseModel
  usersList: UserModel[]

  isFetchingData = true
  isEmpty = true

  // pagination parameters
  pages = []
  minPage = 0
  currentPage = 0
  maxPage = 0
  isStartEnabled: boolean
  isPrevEnabled: boolean
  isNextEnabled: boolean
  isEndEnabled: boolean

  constructor(private userService: UsersService, private paginationService: PaginationService, private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {

    // get the first page of results
    this.onGetPage(0)

    this.userService.usersListResponseSubject.subscribe((response) => {

      console.log("User List Subject Active")

      this.isFetchingData = false
      this.apiResponse = response

      if(this.apiResponse.isSuccessful){

        // refresh the list if a new user was added
        if(this.apiResponse.requestType == "POST"){
          this.onGetPage(0)
          return
        }

        this.paginationResponseModel = this.apiResponse.data
        this.usersList = this.paginationResponseModel.data

        this.isEmpty = false
        this.setUpPagination()
      }
    })
  }

  onUpdateUser(id: string){ 
    // save selected id in service subject 
    this.userService.updateSelectedUserIdSubject(id)

    this.router.navigate(['update']);
  }

  getRoles(user: any): string {
    return user.roles.map((role: { title: any; }) => role.title).join(', ');
  }

  setUpPagination(){

    // setup pagination 
    var paginationParams = this.paginationService.paginationConfig(
      this.apiResponse.data.currentPage, 
      this.apiResponse.data.first, 
      this.apiResponse.data.last, 
      this.apiResponse.data.totalPages
    )

    this.pages = paginationParams.pages
    this.minPage = paginationParams.minPage
    this.currentPage = paginationParams.currentPage
    this.maxPage = paginationParams.maxPage
    this.isStartEnabled = paginationParams.isStartEnabled
    this.isPrevEnabled = paginationParams.isPrevEnabled
    this.isNextEnabled = paginationParams.isNextEnabled
    this.isEndEnabled = paginationParams.isEndEnabled

  }


  onGetPage(page: number){

    this.isFetchingData = true

    // get the first page of results
    this.userService.getUsers({
      pageNumber: page,
      pageSize: 10,
      sortBy: "id"
    })
  }

  onGetPreviousPage(){
    // using paginationResponseModel instead of this.currentPage to not complicate API zero indexing
    if(this.isPrevEnabled)
      this.onGetPage(this.paginationResponseModel.currentPage - 1)
  }

  onGetStartPage(){
    // page indexing starts at zero 
    if(this.isStartEnabled)
      this.onGetPage(0)
  }

  onGetNextPage(){
    // using paginationResponseModel instead of this.currentPage to not complicate API zero indexing
    if(this.isNextEnabled)
      this.onGetPage(this.paginationResponseModel.currentPage + 1)
  }

  onGetEndPage(){
    // page indexing starts at zero 
    if(this.isEndEnabled)
      this.onGetPage(this.paginationResponseModel.totalPages - 1)
  }

}
