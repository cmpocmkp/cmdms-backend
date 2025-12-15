export interface IBaseEntity {
  id: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IAuditableEntity extends IBaseEntity {
  createdBy?: number;
  modifiedBy?: number;
}

