import { Component, EventEmitter, Input, OnChanges, Output } from "@angular/core";
import { CAppService } from "src/app/services/app.service";
import { CUploadService } from "src/app/services/upload.service";
import { ILang } from "src/app/model/entities/lang";
import { IWords } from "src/app/model/entities/words";
import { cfg } from "src/app/app.config";

@Component({
    selector: "image-picker",
    templateUrl: "image-picker.component.html",
    styleUrls: ["image-picker.component.scss"],
})
export class CImagePickerComponent implements OnChanges {
    @Input() folder: string;
    @Input() value: string | File;
    @Output() valueChange: EventEmitter<File> = new EventEmitter();

    public error: boolean = false;
    public img: string = null;
    public active: boolean = false;

    constructor(
        private appService: CAppService,
        private uploadService: CUploadService,
    ) {}

    public ngOnChanges(): void {
        this.buildImg();
    }

    get lang(): ILang {return this.appService.lang.value;}
    get words(): IWords {return this.appService.words;}

    private buildImg(): void {
        this.img = this.value ? 
            (this.value instanceof File ? URL.createObjectURL(this.value) : `/images/${this.folder}/${this.value}`) : 
            null;
    }

    public async onSelect(): Promise<void> {
        try {
            this.error = false;
            this.valueChange.emit(await this.uploadService.selectFiles(false, "image") as File);            
        } catch (err) {
            this.error = true;
        }        
    }    

    public onDelete(): void {
        this.valueChange.emit(null);
    }

    public onDragOver(event: DragEvent): void {        
        event.preventDefault(); // by default we cant drop, just cancel this
        event.stopPropagation();
    }

    public onDragEnter(event: DragEvent): void {
        event.preventDefault();
        event.stopPropagation();
        this.active = true;
    }

    public onDragLeave(event: DragEvent): void {
        event.preventDefault();
        event.stopPropagation();
        this.active = false;
    }  

    public onDrop(event: DragEvent): void {
        event.preventDefault();
        event.stopPropagation();
        this.error = false;
        this.active = false;     
        const droppedFiles = event.dataTransfer.items ? 
            Array.from(event.dataTransfer.items).filter(item => item.kind === "file").map(item => item.getAsFile()) : 
            Array.from(event.dataTransfer.files);       
        const acceptedFiles = droppedFiles.filter(f => f.size <= cfg.maxImageFileSize && cfg.allowedImageTypes.includes(f.type)); 
        
        if (!acceptedFiles.length) {
            this.error = true;
            return;
        }

        this.valueChange.emit(acceptedFiles[0]);
    }    
}