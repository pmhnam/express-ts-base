import userPath from './paths/user.paths.json';
import authPath from './paths/auth.paths.json';
import userSchema from './schemas/user.schema.json';
import roleSchema from './schemas/role.schema.json';
import apiDocs from './common.json';

const allPaths = { ...userPath, ...authPath };
apiDocs.paths = { ...apiDocs.paths, ...allPaths };

apiDocs.components.schemas = {
  ...apiDocs.components.schemas,
  ...userSchema,
  ...roleSchema,
};

export default apiDocs;
