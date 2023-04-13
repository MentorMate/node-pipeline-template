const extend = require('./install-nest');
const {
  createToolboxMock,
  createExtensionInput,
} = require('../utils/test/mocks');

describe('install-nest', () => {
  let toolbox;

  beforeEach(() => {
    toolbox = createToolboxMock();
    extend(toolbox);
  });

  it('should be defined', () => {
    expect(extend).toBeDefined();
  });

  it('should set installNest on toolbox', () => {
    expect(toolbox.installNest).toBeDefined();
  });

  describe('installNest', () => {
    const input = createExtensionInput();

    beforeEach(async () => {
      toolbox.print.muted = jest.fn(() => {});
      toolbox.print.success = jest.fn(() => {});
      toolbox.print.error = jest.fn(() => {});
      toolbox.system.run = jest.fn(() => {});
      await toolbox.installNest(input);
    });

    it('should print a muted and a success message', async () => {
      expect(toolbox.print.muted).toHaveBeenCalledTimes(1);
      expect(toolbox.print.success).toHaveBeenCalledTimes(1);
      expect(toolbox.print.error).not.toHaveBeenCalled();
    });

    it('should install the nest cli', () => {
      expect(toolbox.system.run).toHaveBeenCalledWith('npx @nestjs/cli@^9.0.0');
    });

    describe('when the project is scoped', () => {
      beforeAll(() => {
        input.projectScope = 'scope';
      });

      it('should init a new scoped project', () => {
        expect(toolbox.system.run).toHaveBeenCalledWith(
          `nest new @${input.projectScope}/${input.projectName} --directory ${input.projectName} --skip-git --skip-install --package-manager npm`
        );
      });
    });

    describe('when the project is not scoped', () => {
      beforeAll(() => {
        input.projectScope = '';
      });

      it('should init a new project', () => {
        expect(toolbox.system.run).toHaveBeenCalledWith(
          `nest new ${input.projectName} --directory ${input.projectName} --skip-git --skip-install --package-manager npm`
        );
      });
    });

    it('should print and informative message about the generated example project', () => {
      expect(toolbox.system.run).toHaveBeenCalledWith(
        `echo "This is a sample project generated by @nestjs/cli. You can extend it using the same CLI. For information on commands run" "\`nest --help\`" > ./${input.projectName}/README.md`
      );
    });

    describe('when an error is thrown', () => {
      const error = new Error('the-error');

      beforeEach(() => {
        toolbox.system.run = jest.fn(() => {
          throw error;
        });
      });

      it('should rethrow the error with an added user-friendly message', () => {
        expect(toolbox.installNest(input)).rejects.toThrow(
          `An error has occurred while installing Nest: ${error}`
        );
      });
    });
  });
});
