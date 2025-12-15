import { Component, signal } from '@angular/core';
import {StudentService} from '../../services/student-service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-students',
  imports: [FormsModule, CommonModule],
  templateUrl: './students.html',
  styleUrl: './students.css',
})
export class Students {
  students = signal<any[]>([]);

  selectedStudent = signal<any>({ id: 0, Name: '', Class: 10, Section:'' });

  constructor(private studentservice : StudentService) {
  this.loadStudents();
  }

  loadStudents() {
      this.studentservice.getStudents().subscribe(data => {
        this.students.set(data);
        console.log('Students loaded:', data);
    });    
  }

  saveStudent() {
    const student = this.selectedStudent();

    if (student.id === 0) {
      this.studentservice.addStudent(student).subscribe(() => this.loadStudents());
    } else {
      this.studentservice.updateStudent(student).subscribe(() => this.loadStudents());
    }

    this.resetForm();
  }
  editStudent(o: any) {
    this.selectedStudent.set({ ...o });
  }

  deleteStudent(id: number) {
    this.studentservice.deleteStudent(id).subscribe(() => this.loadStudents());
  }

  resetForm() {
    this.selectedStudent.set({ id: 0, Name : '', Class: 1, Section: '' });
  }
    
}