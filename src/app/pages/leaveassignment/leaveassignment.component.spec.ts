import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaveassignmentComponent } from './leaveassignment.component';

describe('LeaveassignmentComponent', () => {
  let component: LeaveassignmentComponent;
  let fixture: ComponentFixture<LeaveassignmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeaveassignmentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeaveassignmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
