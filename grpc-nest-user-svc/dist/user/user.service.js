"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const typeorm_2 = require("@nestjs/typeorm");
const user_entity_1 = require("./user.entity");
const bcrypt = require("bcryptjs");
const project_entity_1 = require("./project.entity");
let UserService = class UserService {
    constructor(userRepository, projectRepository) {
        this.userRepository = userRepository;
        this.projectRepository = projectRepository;
    }
    async createUser(payload) {
        const user = new user_entity_1.User();
        user.firstName = payload.firstName;
        user.lastName = payload.lastName;
        user.email = payload.email;
        user.password = this.encodePassword(payload.password);
        user.gender = payload.gender;
        user.phoneNumber = payload.phoneNumber;
        user.projects = [];
        await this.userRepository.save(user);
    }
    async createProject(payload) {
        const user = await this.userRepository.findOne({
            where: {
                id: payload.userId,
            },
        });
        const project = new project_entity_1.Project();
        project.name = payload.name;
        project.user = user;
        await this.projectRepository.save(project);
    }
    async queryBuilder(userId, username) {
        return this.userRepository
            .createQueryBuilder('user')
            .where('user.id = :id', { id: userId })
            .andWhere('user.email = :email', { email: username })
            .leftJoinAndSelect('user.projects', 'project')
            .whereInIds([1])
            .orderBy('user.firstName', 'DESC')
            .getMany();
    }
    async rawQuery(userId, username) {
        const rawQuery = 'SELECT * FROM USER a LEFT JOIN PROJECT b on a.id = b.userId ' +
            'WHERE a.id = $1 AND a.email = $2 order by a.firstName DESC';
        return this.userRepository
            .query(rawQuery, [userId, username])
            .then((data) => {
            return data;
        })
            .catch((err) => {
            console.log(err);
        });
    }
    encodePassword(password) {
        const salt = bcrypt.genSaltSync(10);
        return bcrypt.hashSync(password, salt);
    }
};
UserService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_2.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_2.InjectRepository)(project_entity_1.Project)),
    __metadata("design:paramtypes", [typeorm_1.Repository,
        typeorm_1.Repository])
], UserService);
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map