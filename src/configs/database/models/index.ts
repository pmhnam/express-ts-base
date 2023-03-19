import { RoleModel } from './role.model';
import { UserModel } from './user.model';

(async () => {
  UserModel.belongsTo(RoleModel, { as: 'role' });
  RoleModel.hasMany(UserModel, { as: 'users', foreignKey: 'roleId' });
})();

export { RoleModel, UserModel };
