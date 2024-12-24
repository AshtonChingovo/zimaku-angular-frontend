import { Injectable, OnInit } from "@angular/core"

export interface PaginationParams{
    pages: []
    minPage:  0
    currentPage: 0
    maxPage: 0
    isStartEnabled: boolean
    isPrevEnabled: boolean
    isNextEnabled: boolean
    isEndEnabled: boolean
}

@Injectable({ providedIn: "root"})
export class Pagination{

    apiCurrentPage: number
    apiIsFirstPage: Boolean
    apiIsLastPage: Boolean
    apiTotalPages: number

    pages: number[]
    minPage:  number
    currentPage: number
    maxPage: number
    isStartEnabled: boolean
    isPrevEnabled: boolean
    isNextEnabled: boolean
    isEndEnabled: boolean

    paginationConfig(apiCurrentPage: number, apiIsFirstPage: Boolean, 
        apiIsLastPage: Boolean, apiTotalPages: number){
 
        this.apiCurrentPage = apiCurrentPage
        this.apiIsFirstPage = apiIsFirstPage
        this.apiIsLastPage = apiIsLastPage
        this.apiTotalPages = apiTotalPages

        this.setUpPagination()
        this.setUpPages()

        return {
            pages: this.pages,
            minPage:  this.minPage,
            currentPage: this.currentPage,
            maxPage: this.maxPage,
            isStartEnabled: this.isStartEnabled,
            isPrevEnabled: this.isPrevEnabled,
            isNextEnabled: this.isNextEnabled,
            isEndEnabled: this.isEndEnabled
        }
    }

    setUpPagination(){
        // page indexing starts at zero 
        this.currentPage = this.apiCurrentPage + 1
    
        if(this.apiIsFirstPage){
          this.minPage = this.currentPage
          this.maxPage = this.currentPage
    
          this.isStartEnabled = false
          this.isPrevEnabled = false
    
          this.maxPage += (this.currentPage + 2 <= this.apiTotalPages) ? 2 : (this.currentPage + 1 <= this.apiTotalPages) ? 1 : 0 
    
          // if != means a next page is available
          this.isNextEnabled = this.minPage != this.maxPage
          this.isEndEnabled = this.minPage != this.maxPage
    
        }
        else if(this.apiIsLastPage){
          this.maxPage = this.currentPage
          this.minPage = this.currentPage
    
          this.isStartEnabled = true
          this.isPrevEnabled = true
          this.isNextEnabled = false
          this.isEndEnabled = false
    
          this.minPage -= (this.currentPage - 2 > 0) ? 2 : (this.currentPage - 1 > 0) ? 1 : 0 
    
          // if != means a next page is available
          this.isPrevEnabled = this.maxPage != this.minPage
          this.isStartEnabled = this.maxPage != this.minPage
        }
        else{
          this.isStartEnabled = true
          this.isPrevEnabled = true
          this.isNextEnabled = true
          this.isEndEnabled = true
    
          this.minPage = this.currentPage
          this.maxPage = this.currentPage
    
          this.minPage -= (this.currentPage - 1 > 0) ? 1 : 0 
          this.maxPage += (this.currentPage + 1 <= this.apiTotalPages) ? 1 : 0 
    
        }
    
      }
    
      setUpPages(){
        this.pages = []
        var i: number
        for(i = this.minPage; i <= this.maxPage; ++i){
          this.pages.push(i)
        }
      }

}