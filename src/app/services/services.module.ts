import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { CAppService } from './app.service';
import { CDataService } from './data.service';
import { CLangRepository } from './repositories/lang.repository';
import { CPageRepository } from './repositories/page.repository';
import { CSettingRepository } from './repositories/setting.repository';
import { CWordRepository } from './repositories/word.repository';
import { CFileRepository } from './repositories/file.repository';
import { CAuthService } from './auth.service';
import { CAuthGuard } from './guards/auth.guard';
import { CUserRepository } from './repositories/user.repository';
import { CCatRepository } from './repositories/cat.repository';
import { CGuideRepository } from './repositories/guide.repository';
import { CTaskRepository } from './repositories/task.repository';
import { CTariffRepository } from './repositories/tariff.repository';
import { CPromocodeRepository } from './repositories/promocode.repository';
import { CInorderRepository } from './repositories/inorder.repository';
import { CSocketService } from './socket.service';
import { COutorderRepository } from './repositories/outorder.repository';
import { CUploadService } from './upload.service';
import { CGuideNoteRepository } from './repositories/guide.note.repository';
import { CDeskRepository } from './repositories/desk.repository';
import { CProblemRepository } from './repositories/problem.repository';
import { CProblemCommentRepository } from './repositories/problem.comment.repository';
import { CGoogleService } from './google.service';
import { CProposalRepository } from './repositories/proposal.repository';
import { CAuthInterceptor } from './interceptors/auth.interceptor';
import { CHeadersInterceptor } from './interceptors/headers.interceptor';
import { CArtcatRepository } from './repositories/artcat.repository';
import { CArticleRepository } from './repositories/article.repository';
import { CDailerRepository } from './repositories/dailer.repository';
import { CBaxerRepository } from './repositories/baxer.repository';
import { CCommentRepository } from './repositories/comment.repository';
import { CShopcatRepository } from './repositories/shopcat.repository';
import { CShopitemRepository } from './repositories/shopitem.repository';
import { CShoporderRepository } from './repositories/shoporder.repository';
import { CDatemarkRepository } from './repositories/datemark.repository';
import { CDropRepository } from './repositories/drop.repository';

@NgModule({
    declarations: [],
    exports: [],
    providers: [
        // interceptors
        {provide: HTTP_INTERCEPTORS, useClass: CAuthInterceptor, multi: true},
        {provide: HTTP_INTERCEPTORS, useClass: CHeadersInterceptor, multi: true},
        // services
        CAppService,
        CDataService,
        CAuthService,
        CSocketService,
        CUploadService,
        CGoogleService,
        // guards
        CAuthGuard,
        // repo
        CSettingRepository,
        CLangRepository,
        CWordRepository,
        CPageRepository,
        CFileRepository,
        CUserRepository,
        CCatRepository,
        CGuideRepository,
        CGuideNoteRepository,
        CTaskRepository,
        CTariffRepository,
        CPromocodeRepository,
        CInorderRepository,
        COutorderRepository,
        CDeskRepository,
        CProblemRepository,
        CProblemCommentRepository,
        CProposalRepository,
        CArtcatRepository,
        CArticleRepository,
        CDailerRepository,
        CBaxerRepository,
        CCommentRepository,
        CShopcatRepository,
        CShopitemRepository,
        CShoporderRepository,
        CDatemarkRepository,
        CDropRepository,
    ],
})
export class CServicesModule {}
