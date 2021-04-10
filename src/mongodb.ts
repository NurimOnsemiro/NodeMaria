import mongoose, { Document, Model, Schema } from 'mongoose';
import moment from 'moment';

import autoIncrement from 'mongoose-auto-increment';
import { default as objSample } from '../assets/object_sample.json';
//import { ESearchMode, ISearchQueryData } from '../object_manage/search_query_manager';
//import { serverConfig } from '../server_manage/server_config';
import { filetimeFromDate, getRandomValue } from './utils';
import { makeEventRefId, makePeopleRefLabelId } from './websocket';

let labelIdList = [
    100000,
    101000,
    102000,
    103000,
    104000,
    105000,
    106000,
    200000,
    201000,
    202000,
    203000,
    204000,
    205000,
    206000,
    207000,
    208000,
    209000,
    300000,
    301000,
    302000,
    303000,
    304000,
    305000,
    306000,
    307000,
    308000,
    309000,
    310000,
    311000,
    400000,
    401000,
    402000,
    500000,
    501000,
    502000,
];

let eventIdList = [0, 1, 2, 4, 8, 16, 32, 64];

let dataSample = {
    mas_serial: objSample.mas_serial,
    object_id: objSample.object.objectId,
    start_time: filetimeFromDate(),
    end_time: filetimeFromDate(),
    ref_device_id: 57,
    ref_label_id: 100000,
    ref_event_id: 64,
    ref_attr_color1: 3056,
    ref_attr_color2: 3056,
    ref_attr_color3: 3056,
    attr_score: 0.99965,
    attr_bag_pack: 0,
    attr_bag_etc: 0,
    attr_umbrella: 0,
    thumbnail_time: filetimeFromDate(),
    thumbnail:
        '{"thumbnail":"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","thumbnailRect":{"x":0.5838541666666667,"y":0.5388888888888889,"w":0.2822916666666666,"h":0.425}}',
};

export interface ISchemaObject extends Document {
    object_idx?: number;
    mas_serial?: number;
    object_id?: number;
    start_time?: number;
    end_time?: number;
    ref_device_id?: number;
    ref_label_id?: number;
    ref_event_id?: number;
    ref_attr_color1?: number;
    attr_score?: number;
    attr_bag_pack?: number;
    attr_bag_etc?: number;
    attr_umbrella?: number;
    thumbnail_time?: number;
    thumbnail?: string;
}

export const SchemaObject = new Schema({
    object_idx: { type: Number },
    mas_serial: { type: Number },
    object_id: { type: Number },
    start_time: { type: Date },
    end_time: { type: Date },
    ref_device_id: { type: Number },
    ref_label_id: { type: Number },
    ref_event_id: { type: Number },
    ref_attr_color1: { type: Number },
    ref_attr_color2: { type: Number },
    ref_attr_color3: { type: Number },
    attr_score: { type: Number },
    attr_bag_pack: { type: Number },
    attr_bag_etc: { type: Number },
    attr_umbrella: { type: Number },
    thumbnail_time: { type: Date },
    thumbnail: { type: String },
    createdAt: { type: Date, expires: '300d', default: Date.now }, //300일후 자동 삭제
});

export const enum EMongodbCollection {
    Object = 'col_object',
    ObjectPerson = 'col_object_person',
    ObjectVehicle = 'col_object_vehicle',
    ObjectVessel = 'col_object_vessel',
    ObjectIncident = 'col_object_incident',
    ObjectHead = 'col_object_head',
}

export const ModelObject = mongoose.model<ISchemaObject>(EMongodbCollection.Object, SchemaObject);

class mongo_base {
    constructor() {}

    public async init(serverIp: string) {
        console.log('[MongoDB] init start.');

        await this.connectMongoDb(serverIp);

        this.registerAutoIncrement();

        console.log('[MongoDB] init ok.');
    }

    public registerAutoIncrement() {
        SchemaObject.plugin(autoIncrement.plugin, {
            model: EMongodbCollection.Object,
            field: 'object_idx',
            startAt: 1,
            increment: 1,
        });
    }

    /**
     * INFO: 몽고DB 서버에 접속합니다.
     */
    public async connectMongoDb(serverIp: string): Promise<void> {
        return new Promise(async (resolve, reject) => {
            try {
                //INFO: 몽고DB 서버 주소
                const MONGODB_SERVER_URI: string = `mongodb://${serverIp}:27017/db_mam`;

                let res = await mongoose.connect(MONGODB_SERVER_URI, {
                    useNewUrlParser: true,
                    useUnifiedTopology: true,
                });
                autoIncrement.initialize(res.connection);
                resolve();
            } catch (ex) {
                reject(ex);
            }
        });
    }

    /**
     * INFO: 콜렉션에 다큐먼트를 저장합니다.
     * @param doc 저장할 다큐먼트
     */
    public async insertDocument(doc: Document): Promise<Document> {
        return new Promise(async (resolve, reject) => {
            doc.save((err, doc) => {
                if (err) {
                    reject(err);
                }
                resolve(doc);
            });
        });
    }

    /** INFO: 다큐먼트들을 벌크로 삽입 */
    public async insertBulkDocuments(docs: Document[]): Promise<void> {
        return new Promise(async (resolve, reject) => {
            ModelObject.insertMany(docs, null, (err, docs) => {
                if (err) {
                    reject(err);
                }
                resolve();
            });
        });
    }

    /**
     * 특정 개수만큼 레코드 삽입
     * @param numRecords 삽입할 행 개수
     */
    public async startObjectInsertCount(numRecords: number) {
        console.log('[INSERTOBJCNT] Ready');
        console.time('MongoDBInsert');
        let docs: Document[] = [];
        for (let i = 0; i < numRecords; i++) {
            if (i % 300 === 0) {
                console.log(`[OBJ] Inserting - ${i}/${numRecords}`);
                await this.insertBulkDocuments(docs);
                docs = [];
            }
            dataSample.attr_bag_etc = getRandomValue(0, 1);
            dataSample.attr_score = Math.random();
            dataSample.ref_label_id = labelIdList[getRandomValue(0, labelIdList.length - 1)];
            dataSample.ref_event_id = eventIdList[getRandomValue(0, eventIdList.length - 1)];
            dataSample.start_time = Date.now();
            dataSample.end_time = Date.now();
            dataSample.attr_umbrella = getRandomValue(0, 1);
            dataSample.object_id = getRandomValue(0, 1000000);
            dataSample.ref_attr_color1 = getRandomValue(0, 12) * 1000 + getRandomValue(0, 100);
            dataSample.ref_attr_color2 = getRandomValue(0, 12) * 1000 + getRandomValue(0, 100);
            dataSample.ref_attr_color3 = getRandomValue(0, 12) * 1000 + getRandomValue(0, 100);
            dataSample.ref_device_id = getRandomValue(1, 600);
            dataSample.mas_serial = getRandomValue(1, 12);
            dataSample.thumbnail_time = Date.now();

            let newObjData: ISchemaObject = new ModelObject();
            for (let key in dataSample) {
                newObjData[key] = dataSample[key];
            }
            docs.push(newObjData);
        }

        if (docs.length !== 0) {
            await this.insertBulkDocuments(docs);
            docs = [];
        }
        console.timeEnd('MongoDBInsert');
        console.log('[INSERTOBJCNT] Finish');
        process.exit(0);
    }

    /**
     * INFO: 조건을 만족하는 모든 다큐먼트 반환
     */
    public async findAllDocument(
        model: Model<Document>,
        condition: object,
        sortCond: object = null,
        skip: number = 0,
        limit: number = 0,
    ): Promise<Document[]> {
        return new Promise(async (resolve, reject) => {
            model
                .find(condition, (err, res) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(res);
                })
                .sort(sortCond)
                .skip(skip)
                .limit(limit);
        });
    }

    /**
     * INFO: 조건을 만족하는 다큐먼트 개수 반환
     */
    public async findDocumentCount(
        model: Model<Document>,
        condition: object,
        sortCond: object = null,
        skip: number = 0,
        limit: number = 0,
    ): Promise<number> {
        return new Promise(async (resolve, reject) => {
            model
                .countDocuments(condition, (err, count) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(count);
                })
                .sort(sortCond)
                .skip(skip)
                .limit(limit);
        });
    }
}

const mongoBase = new mongo_base();
export { mongoBase };
