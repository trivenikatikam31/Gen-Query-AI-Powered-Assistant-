import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UploadDocumentsPage } from './upload-documents.page';

describe('UploadDocumentsPage', () => {
  let component: UploadDocumentsPage;
  let fixture: ComponentFixture<UploadDocumentsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadDocumentsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
