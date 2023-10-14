import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { TuiTablePagination, TuiTablePaginationModule } from '@taiga-ui/addon-table';
import { TuiScrollService } from '@taiga-ui/cdk';
import {
    TuiLinkModule,
    TuiLoaderModule, TuiScrollbarComponent, TuiScrollbarModule, TuiSvgModule
} from '@taiga-ui/core';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { Subject, debounceTime } from 'rxjs';
import { PaginateDetails, Tweet, getTweetSmall } from 'shared';

@Component({
    selector: 'lib-image-grid',
    standalone: true,
    imports: [CommonModule, TuiTablePaginationModule, TuiScrollbarModule, TuiLoaderModule,
        TuiSvgModule, TuiLinkModule, InfiniteScrollModule
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [TuiScrollService],
    templateUrl: './image-grid.component.html',
    styleUrls: ['./image-grid.component.scss'],
})
export class ImageGridComponent implements OnInit {
    @ViewChild(TuiScrollbarComponent, { read: ElementRef })
    private readonly scrollBar?: ElementRef<HTMLElement>;
    debouncer: Subject<TuiTablePagination> = new Subject<TuiTablePagination>();

    getTweetSmall = getTweetSmall;
    @Input() tweets$!: Subject<Tweet[]>;
    tweets: Tweet[] = [];
    @Input() loading$!: Subject<boolean>;

    @Input() limit = 30;
    @Input() page = 0;
    @Input() paginateDetails!: PaginateDetails;
    @Output() paginationChanged: EventEmitter<TuiTablePagination> = new EventEmitter();

    constructor() {
      this.debouncer
      .pipe(debounceTime(250))
      .subscribe((value) => this.paginationChanged.emit(value));
    }

    ngOnInit(): void {
        this.tweets$.subscribe((tweets: Tweet[]) => {
            this.tweets = [...this.tweets, ...tweets];
            console.log(tweets);
        });
    }

    onScrollDown() {
        console.log('scrolled')
        this.debouncer.next({page:this.page +1, size: this.limit});
    }

    pageChanged(pagination: TuiTablePagination) {
        this.debouncer.next(pagination);
        if (!this.scrollBar) {
            return;
        }
        const { nativeElement } = this.scrollBar;
        nativeElement.scrollTop = 0;
    }

    clickImage(user: string, tweetId: string) {
        window.open(`https://twitter.com/${user}/status/${tweetId}`, "_blank");
    }
}
