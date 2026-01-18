"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.LambdaStack = void 0;
const cdk = __importStar(require("aws-cdk-lib"));
const lambda = __importStar(require("aws-cdk-lib/aws-lambda"));
const path = __importStar(require("path"));
class LambdaStack extends cdk.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        // 下载处理 Lambda 函数
        this.downloadHandler = new lambda.Function(this, 'DownloadHandler', {
            functionName: 'macos-app-download-handler',
            runtime: lambda.Runtime.NODEJS_20_X,
            handler: 'index.handler',
            code: lambda.Code.fromAsset(path.join(__dirname, '../../backend/functions/download-handler')),
            environment: {
                DOWNLOADS_TABLE_NAME: props.downloadsTable.tableName,
            },
            timeout: cdk.Duration.seconds(10),
            memorySize: 256,
        });
        // 授予 Lambda 读写 Downloads 表的权限
        props.downloadsTable.grantReadWriteData(this.downloadHandler);
        // 留言处理 Lambda 函数
        this.messageHandler = new lambda.Function(this, 'MessageHandler', {
            functionName: 'macos-app-message-handler',
            runtime: lambda.Runtime.NODEJS_20_X,
            handler: 'index.handler',
            code: lambda.Code.fromAsset(path.join(__dirname, '../../backend/functions/message-handler')),
            environment: {
                MESSAGES_TABLE_NAME: props.messagesTable.tableName,
                RATE_LIMITS_TABLE_NAME: props.rateLimitsTable.tableName,
            },
            timeout: cdk.Duration.seconds(10),
            memorySize: 256,
        });
        // 授予 Lambda 读写 Messages 和 RateLimits 表的权限
        props.messagesTable.grantReadWriteData(this.messageHandler);
        props.rateLimitsTable.grantReadWriteData(this.messageHandler);
        // 输出 Lambda 函数 ARN
        new cdk.CfnOutput(this, 'DownloadHandlerArn', {
            value: this.downloadHandler.functionArn,
            description: 'Download handler Lambda ARN',
        });
        new cdk.CfnOutput(this, 'MessageHandlerArn', {
            value: this.messageHandler.functionArn,
            description: 'Message handler Lambda ARN',
        });
    }
}
exports.LambdaStack = LambdaStack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGFtYmRhLXN0YWNrLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsibGFtYmRhLXN0YWNrLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLGlEQUFtQztBQUNuQywrREFBaUQ7QUFHakQsMkNBQTZCO0FBUTdCLE1BQWEsV0FBWSxTQUFRLEdBQUcsQ0FBQyxLQUFLO0lBSXhDLFlBQVksS0FBZ0IsRUFBRSxFQUFVLEVBQUUsS0FBdUI7UUFDL0QsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFFeEIsaUJBQWlCO1FBQ2pCLElBQUksQ0FBQyxlQUFlLEdBQUcsSUFBSSxNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxpQkFBaUIsRUFBRTtZQUNsRSxZQUFZLEVBQUUsNEJBQTRCO1lBQzFDLE9BQU8sRUFBRSxNQUFNLENBQUMsT0FBTyxDQUFDLFdBQVc7WUFDbkMsT0FBTyxFQUFFLGVBQWU7WUFDeEIsSUFBSSxFQUFFLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLDBDQUEwQyxDQUFDLENBQUM7WUFDN0YsV0FBVyxFQUFFO2dCQUNYLG9CQUFvQixFQUFFLEtBQUssQ0FBQyxjQUFjLENBQUMsU0FBUzthQUNyRDtZQUNELE9BQU8sRUFBRSxHQUFHLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUM7WUFDakMsVUFBVSxFQUFFLEdBQUc7U0FDaEIsQ0FBQyxDQUFDO1FBRUgsOEJBQThCO1FBQzlCLEtBQUssQ0FBQyxjQUFjLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDO1FBRTlELGlCQUFpQjtRQUNqQixJQUFJLENBQUMsY0FBYyxHQUFHLElBQUksTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsZ0JBQWdCLEVBQUU7WUFDaEUsWUFBWSxFQUFFLDJCQUEyQjtZQUN6QyxPQUFPLEVBQUUsTUFBTSxDQUFDLE9BQU8sQ0FBQyxXQUFXO1lBQ25DLE9BQU8sRUFBRSxlQUFlO1lBQ3hCLElBQUksRUFBRSxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSx5Q0FBeUMsQ0FBQyxDQUFDO1lBQzVGLFdBQVcsRUFBRTtnQkFDWCxtQkFBbUIsRUFBRSxLQUFLLENBQUMsYUFBYSxDQUFDLFNBQVM7Z0JBQ2xELHNCQUFzQixFQUFFLEtBQUssQ0FBQyxlQUFlLENBQUMsU0FBUzthQUN4RDtZQUNELE9BQU8sRUFBRSxHQUFHLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUM7WUFDakMsVUFBVSxFQUFFLEdBQUc7U0FDaEIsQ0FBQyxDQUFDO1FBRUgsMENBQTBDO1FBQzFDLEtBQUssQ0FBQyxhQUFhLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBQzVELEtBQUssQ0FBQyxlQUFlLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBRTlELG1CQUFtQjtRQUNuQixJQUFJLEdBQUcsQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLG9CQUFvQixFQUFFO1lBQzVDLEtBQUssRUFBRSxJQUFJLENBQUMsZUFBZSxDQUFDLFdBQVc7WUFDdkMsV0FBVyxFQUFFLDZCQUE2QjtTQUMzQyxDQUFDLENBQUM7UUFFSCxJQUFJLEdBQUcsQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLG1CQUFtQixFQUFFO1lBQzNDLEtBQUssRUFBRSxJQUFJLENBQUMsY0FBYyxDQUFDLFdBQVc7WUFDdEMsV0FBVyxFQUFFLDRCQUE0QjtTQUMxQyxDQUFDLENBQUM7SUFDTCxDQUFDO0NBQ0Y7QUFwREQsa0NBb0RDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgY2RrIGZyb20gJ2F3cy1jZGstbGliJztcbmltcG9ydCAqIGFzIGxhbWJkYSBmcm9tICdhd3MtY2RrLWxpYi9hd3MtbGFtYmRhJztcbmltcG9ydCAqIGFzIGR5bmFtb2RiIGZyb20gJ2F3cy1jZGstbGliL2F3cy1keW5hbW9kYic7XG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCAqIGFzIHBhdGggZnJvbSAncGF0aCc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgTGFtYmRhU3RhY2tQcm9wcyBleHRlbmRzIGNkay5TdGFja1Byb3BzIHtcbiAgZG93bmxvYWRzVGFibGU6IGR5bmFtb2RiLlRhYmxlO1xuICBtZXNzYWdlc1RhYmxlOiBkeW5hbW9kYi5UYWJsZTtcbiAgcmF0ZUxpbWl0c1RhYmxlOiBkeW5hbW9kYi5UYWJsZTtcbn1cblxuZXhwb3J0IGNsYXNzIExhbWJkYVN0YWNrIGV4dGVuZHMgY2RrLlN0YWNrIHtcbiAgcHVibGljIHJlYWRvbmx5IGRvd25sb2FkSGFuZGxlcjogbGFtYmRhLkZ1bmN0aW9uO1xuICBwdWJsaWMgcmVhZG9ubHkgbWVzc2FnZUhhbmRsZXI6IGxhbWJkYS5GdW5jdGlvbjtcblxuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogTGFtYmRhU3RhY2tQcm9wcykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCwgcHJvcHMpO1xuXG4gICAgLy8g5LiL6L295aSE55CGIExhbWJkYSDlh73mlbBcbiAgICB0aGlzLmRvd25sb2FkSGFuZGxlciA9IG5ldyBsYW1iZGEuRnVuY3Rpb24odGhpcywgJ0Rvd25sb2FkSGFuZGxlcicsIHtcbiAgICAgIGZ1bmN0aW9uTmFtZTogJ21hY29zLWFwcC1kb3dubG9hZC1oYW5kbGVyJyxcbiAgICAgIHJ1bnRpbWU6IGxhbWJkYS5SdW50aW1lLk5PREVKU18yMF9YLFxuICAgICAgaGFuZGxlcjogJ2luZGV4LmhhbmRsZXInLFxuICAgICAgY29kZTogbGFtYmRhLkNvZGUuZnJvbUFzc2V0KHBhdGguam9pbihfX2Rpcm5hbWUsICcuLi8uLi9iYWNrZW5kL2Z1bmN0aW9ucy9kb3dubG9hZC1oYW5kbGVyJykpLFxuICAgICAgZW52aXJvbm1lbnQ6IHtcbiAgICAgICAgRE9XTkxPQURTX1RBQkxFX05BTUU6IHByb3BzLmRvd25sb2Fkc1RhYmxlLnRhYmxlTmFtZSxcbiAgICAgIH0sXG4gICAgICB0aW1lb3V0OiBjZGsuRHVyYXRpb24uc2Vjb25kcygxMCksXG4gICAgICBtZW1vcnlTaXplOiAyNTYsXG4gICAgfSk7XG5cbiAgICAvLyDmjojkuoggTGFtYmRhIOivu+WGmSBEb3dubG9hZHMg6KGo55qE5p2D6ZmQXG4gICAgcHJvcHMuZG93bmxvYWRzVGFibGUuZ3JhbnRSZWFkV3JpdGVEYXRhKHRoaXMuZG93bmxvYWRIYW5kbGVyKTtcblxuICAgIC8vIOeVmeiogOWkhOeQhiBMYW1iZGEg5Ye95pWwXG4gICAgdGhpcy5tZXNzYWdlSGFuZGxlciA9IG5ldyBsYW1iZGEuRnVuY3Rpb24odGhpcywgJ01lc3NhZ2VIYW5kbGVyJywge1xuICAgICAgZnVuY3Rpb25OYW1lOiAnbWFjb3MtYXBwLW1lc3NhZ2UtaGFuZGxlcicsXG4gICAgICBydW50aW1lOiBsYW1iZGEuUnVudGltZS5OT0RFSlNfMjBfWCxcbiAgICAgIGhhbmRsZXI6ICdpbmRleC5oYW5kbGVyJyxcbiAgICAgIGNvZGU6IGxhbWJkYS5Db2RlLmZyb21Bc3NldChwYXRoLmpvaW4oX19kaXJuYW1lLCAnLi4vLi4vYmFja2VuZC9mdW5jdGlvbnMvbWVzc2FnZS1oYW5kbGVyJykpLFxuICAgICAgZW52aXJvbm1lbnQ6IHtcbiAgICAgICAgTUVTU0FHRVNfVEFCTEVfTkFNRTogcHJvcHMubWVzc2FnZXNUYWJsZS50YWJsZU5hbWUsXG4gICAgICAgIFJBVEVfTElNSVRTX1RBQkxFX05BTUU6IHByb3BzLnJhdGVMaW1pdHNUYWJsZS50YWJsZU5hbWUsXG4gICAgICB9LFxuICAgICAgdGltZW91dDogY2RrLkR1cmF0aW9uLnNlY29uZHMoMTApLFxuICAgICAgbWVtb3J5U2l6ZTogMjU2LFxuICAgIH0pO1xuXG4gICAgLy8g5o6I5LqIIExhbWJkYSDor7vlhpkgTWVzc2FnZXMg5ZKMIFJhdGVMaW1pdHMg6KGo55qE5p2D6ZmQXG4gICAgcHJvcHMubWVzc2FnZXNUYWJsZS5ncmFudFJlYWRXcml0ZURhdGEodGhpcy5tZXNzYWdlSGFuZGxlcik7XG4gICAgcHJvcHMucmF0ZUxpbWl0c1RhYmxlLmdyYW50UmVhZFdyaXRlRGF0YSh0aGlzLm1lc3NhZ2VIYW5kbGVyKTtcblxuICAgIC8vIOi+k+WHuiBMYW1iZGEg5Ye95pWwIEFSTlxuICAgIG5ldyBjZGsuQ2ZuT3V0cHV0KHRoaXMsICdEb3dubG9hZEhhbmRsZXJBcm4nLCB7XG4gICAgICB2YWx1ZTogdGhpcy5kb3dubG9hZEhhbmRsZXIuZnVuY3Rpb25Bcm4sXG4gICAgICBkZXNjcmlwdGlvbjogJ0Rvd25sb2FkIGhhbmRsZXIgTGFtYmRhIEFSTicsXG4gICAgfSk7XG5cbiAgICBuZXcgY2RrLkNmbk91dHB1dCh0aGlzLCAnTWVzc2FnZUhhbmRsZXJBcm4nLCB7XG4gICAgICB2YWx1ZTogdGhpcy5tZXNzYWdlSGFuZGxlci5mdW5jdGlvbkFybixcbiAgICAgIGRlc2NyaXB0aW9uOiAnTWVzc2FnZSBoYW5kbGVyIExhbWJkYSBBUk4nLFxuICAgIH0pO1xuICB9XG59XG4iXX0=