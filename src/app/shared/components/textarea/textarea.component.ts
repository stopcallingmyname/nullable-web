import { CommonModule } from '@angular/common';
import { Component, forwardRef, Input, OnInit } from '@angular/core';
import {
  ControlValueAccessor,
  FormBuilder,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import { Nullable } from 'primeng/ts-helpers';

@Component({
  selector: 'nb-textarea',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextareaComponent),
      multi: true,
    },
  ],
  templateUrl: './textarea.component.html',
  styleUrl: './textarea.component.scss',
})
export class TextareaComponent implements OnInit, ControlValueAccessor {
  @Input() label?: string;
  @Input() limit?: string;
  @Input() modelValue?: string | null;

  charactersEntered: number;
  value: string;

  public onChange: (value: any) => {};
  public onTouched: () => {};

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initializeValues();
    this.validateContentLength();
  }

  initializeValues() {
    this.charactersEntered = 0;
  }

  validateContentLength() {
    this.charactersEntered = this.modelValue ? this.modelValue.length : 0;
  }

  isLengthValid(): boolean {
    return this.charactersEntered < Number(this.limit);
  }

  changeTextareaValue(e: any) {
    this.modelValue = e.target.value;
    this.validateContentLength();
    this.onChange(e.target.value);
  }

  // Interface for ControlValueAccessor
  writeValue(value: any): void {
    this.value = value ? value : '';
  }

  // value changes
  registerOnChange(fn: any) {
    this.onChange = fn;
  }

  // blur
  registerOnTouched(fn: any) {
    this.onTouched = fn;
  }
}
