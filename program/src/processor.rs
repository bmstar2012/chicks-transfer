use solana_program::{
    account_info::{next_account_info, AccountInfo},
    entrypoint::ProgramResult,
    msg,
    program::{invoke, invoke_signed},
    program_error::ProgramError,
    program_pack::{IsInitialized, Pack},
    pubkey::Pubkey,
    sysvar::{rent::Rent, Sysvar},
};

use spl_token::state::Account as TokenAccount;

use crate::{error::EscrowError, instruction::EscrowInstruction, state::Escrow};

pub struct Processor;
impl Processor {
    pub fn process(
        program_id: &Pubkey,
        accounts: &[AccountInfo],
        instruction_data: &[u8],
    ) -> ProgramResult {
        let instruction = EscrowInstruction::unpack(instruction_data)?;

        match instruction {
            EscrowInstruction::Transfer { amount } => {
                msg!("Instruction: Transfer");
                Self::process_transfer(accounts, amount, program_id)
            }
        }
    }

    fn process_transfer(
        accounts: &[AccountInfo],
        amount: u64,
        _program_id: &Pubkey,
    ) -> ProgramResult {

        let fee = 5.0;
        let fee_f64 = amount as f64 / 100.0 * fee;
        let fee_amount: u64 = fee_f64 as u64;

        let account_info_iter = &mut accounts.iter();
        let initializer = next_account_info(account_info_iter)?; //Alice: signer

        if !initializer.is_signer {
            return Err(ProgramError::MissingRequiredSignature);
        }

        let alice_token_account = next_account_info(account_info_iter)?; //Alice's X token

        let bob_token_account = next_account_info(account_info_iter)?; //Bob's X token
        if *bob_token_account.owner != spl_token::id() {
            return Err(ProgramError::IncorrectProgramId);
        }
        let service_token_account = next_account_info(account_info_iter)?; //Service's X token
        if *service_token_account.owner != spl_token::id() {
            return Err(ProgramError::IncorrectProgramId);
        }
        let token_program = next_account_info(account_info_iter)?;

        msg!("Transfer the token to Bob - start");
        let transfer_to_initializer_ix = spl_token::instruction::transfer(
            token_program.key,
            alice_token_account.key,
            bob_token_account.key,
            initializer.key,
            &[&initializer.key],
            amount - fee_amount,
        )?;
        msg!("Transfer the token to Bob - ready");
        invoke(
            &transfer_to_initializer_ix,
            &[
                alice_token_account.clone(),
                bob_token_account.clone(),
                initializer.clone(),
                token_program.clone(),
            ],
        )?;
        msg!("Transfer the token to Bob - end");

        msg!("Transfer the fee to Service - start");
        let transfer_to_initializer_ix = spl_token::instruction::transfer(
            token_program.key,
            alice_token_account.key,
            service_token_account.key,
            initializer.key,
            &[&initializer.key],
            fee_amount,
        )?;
        msg!("Transfer the fee to Service - ready");
        invoke(
            &transfer_to_initializer_ix,
            &[
                alice_token_account.clone(),
                service_token_account.clone(),
                initializer.clone(),
                token_program.clone(),
            ],
        )?;
        msg!("Transfer the fee to Service - end");

        Ok(())
    }
}
