import { RoleModel } from '@models/role.model';
import { UserModel } from '@models/user.model';

(async () => {
  UserModel.belongsTo(RoleModel, { as: 'role' });
  RoleModel.hasMany(UserModel, { as: 'users', foreignKey: 'roleId' });
})();

export { RoleModel, UserModel };
