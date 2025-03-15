import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ScanComponent } from './scan.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ScanComponent', () => {
  let component: ScanComponent;
  let fixture: ComponentFixture<ScanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScanComponent, HttpClientTestingModule]
    }).compileComponents();

    fixture = TestBed.createComponent(ScanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update selectedFileName when file is uploaded', () => {
    const mockFile = new File(["test,content"], "test.csv", { type: "text/csv" });
    const event = {
      target: { files: [mockFile] }
    } as unknown as Event;

    component.onFileSelected(event);
    expect(component.selectedFileName).toBe('test.csv');
  });
});
