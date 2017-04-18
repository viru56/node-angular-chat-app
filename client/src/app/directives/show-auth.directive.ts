import { Directive, Input, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { UserService } from '../services';

@Directive({
  selector: '[appShowAuth]'
})
export class ShowAuthDirective implements OnInit {

  condition: boolean;
  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainerRef: ViewContainerRef,
    private userService: UserService
  ) { }
  ngOnInit() {
    this.userService.isAuthenticated.subscribe(isAuthenticated => {
      if (isAuthenticated && this.condition || !isAuthenticated && !this.condition) {
        this.viewContainerRef.createEmbeddedView(this.templateRef);
      } else {
        this.viewContainerRef.clear();
      }
    });
  }
  @Input() set appShowAuth(condition: boolean) {
    this.condition = condition;
  }
}
